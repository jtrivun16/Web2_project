import React, {useState, useEffect} from "react";
import { GetArtikalById, UpdateArtikal } from "../Services/ArtikalService";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage";
import productImage from "../Images/product.jpg";
import { Button } from "@mui/material";

export default function IzmijeniArtikal() {

  const [id, setId] = useState(0);
  const [naziv, setNaziv] = useState("");
  const [cena, setCena] = useState(0);
  const [kolicina, setKolicina] = useState(0);
  const [opis, setOpis] = useState("");
  const [fotografija, setFotografija] = useState(productImage);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const getArtikaId = async () => {
      const pathname = window.location.pathname;
      const stringId = pathname.split("/")[3];

      const id = parseInt(stringId);
      setId(id);

      const response = await GetArtikalById(id, sessionStorage.getItem("token"));
      if (response !== null) {
        setNaziv(response.naziv);
        setCena(response.cena);
        setKolicina(response.kolicina);
        setOpis(response.opis);
        setFotografija(response.fotografija)
        setLoading(false);
      }
    };
    getArtikaId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(naziv, cena, kolicina, opis);
    const prodavac = JSON.parse(sessionStorage.getItem('korisnik'));
    const token = sessionStorage.getItem('token');
    const prodavacId = prodavac.id;
    const cenaDostave = prodavac.cenaDostave;

    if(naziv.length === 0 || cena === 0 || cena === "" || Math.floor(kolicina) === 0 || kolicina === ""
    || opis.length === 0 || fotografija.length === 0){
        setError(true);
        return;
    }

    const artikalDto = JSON.stringify({
        naziv, cena, kolicina, opis, fotografija, prodavacId, cenaDostave
    });

    const response = await UpdateArtikal(id, artikalDto, token);
    if(response !== null){
      alert("Uspešno ste ažurirali artikal.");
      navigate('/prodavacSviArtikli');     
    }
    else{
      setLoading(true);
    }


  };

  return (
    <>
      {loading && (
        <div className="loader-container">
          <div className="ui active inverted dimmer">
            <div className="ui large text loader">Ucitavanje artikla</div>
          </div>
        </div>
      )}
      {!loading && (
        <div className="card">
          <form className="ui form" onSubmit={handleSubmit}>
            <h2 className="ui center aligned header">Izmena artikla</h2>
            <UserImage slika={fotografija} setSlika={setFotografija}></UserImage>
              {error && fotografija.length === 0 ? (
                <div className="ui pointing red basic label">
                  Morate izabrati fotografiju
                </div>
              ) : null}
            <div className="field">
              <label>Naziv artikla</label>
              <input
                type="text"
                name="naziv"
                placeholder="Naziv artikla"
                value={naziv}
                onChange={(e) => setNaziv(e.target.value)}
              />
              {error && naziv.length === 0 ? (
                <div className="ui pointing red basic label">
                  Morate uneti naziv artikla
                </div>
              ) : null}
            </div>
            <div className="two fields">
              <div className="field">
                <label>Cena artikla</label>
                <input
                  type="number"
                  step="any"
                  name="cena"
                  value={cena}
                  onChange={(e) => setCena(e.target.value)}
                  placeholder="Cena artikla"
                />
                {(error && cena === 0) || (error && cena === "") ? (
                  <div className="ui pointing red basic label">
                    Morate uneti cenu artikla
                  </div>
                ) : null}
              </div>
              <div className="field">
                <label>Kolicina artikla</label>
                <input
                  type="number"
                  step="1"
                  name="kolicina"
                  value={kolicina}
                  onChange={(e) => setKolicina(e.target.value)}
                  placeholder="Kolicina artikla"
                />
                {(error && Math.floor(kolicina) === 0) || ( error && cena === "") ? (
                  <div className="ui pointing red basic label">
                    Morate uneti kolicinu artikla
                  </div>
                ) : null}
              </div>
            </div>
            <div className="field">
              <label>Opis</label>
              <textarea
                className="textarea-resize"
                rows="6"
                placeholder="Unesite opis artikla"
                value={opis}
                onChange={(e) => setOpis(e.target.value)}
              />
              {error && opis.length === 0 ? (
                <div className="ui pointing red basic label">
                  Morate uneti opis artikla
                </div>
              ) : null}
            </div>
            <Button variant="contained" type="submit">
              Izmenite artikal
            </Button>
          </form>
        </div>
      )}
    </>
  );
}