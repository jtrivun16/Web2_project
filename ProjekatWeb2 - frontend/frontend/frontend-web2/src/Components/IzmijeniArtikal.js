import React, {useState, useEffect} from "react";
import { GetArtikalById, UpdateArtikal } from "../Services/ArtikalService";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage";
import productImage from "../Images/product.jpg";
import { Button } from "@mui/material";

export default function IzmijeniArtikal() {

  const [id, setId] = useState(0);
  const [naziv, setNaziv] = useState("");
  const [cijena, setCijena] = useState(0);
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
        setCijena(response.cijena);
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
    console.log(naziv, cijena, kolicina, opis);
    const prodavac = JSON.parse(sessionStorage.getItem('korisnik'));
    const token = sessionStorage.getItem('token');
    const prodavacId = prodavac.id;
    const cijenaDostave = prodavac.cijenaDostave;

    if(naziv.length === 0 || cijena === 0 || cijena === "" || Math.floor(kolicina) === 0 || kolicina === ""
    || opis.length === 0 || fotografija.length === 0){
        setError(true);
        return;
    }

    const artikalDto = JSON.stringify({
        naziv, cijena, kolicina, opis, fotografija, prodavacId, cijenaDostave
    });

    const response = await UpdateArtikal(id, artikalDto, token);
    if(response !== null){
      alert("Uspješno ste ažurirali artikal.");
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
            <h2 className="ui center aligned header">Izmjena artikla</h2>
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
                  Morate unijeti naziv artikla
                </div>
              ) : null}
            </div>
            <div className="two fields">
              <div className="field">
                <label>Cijena artikla</label>
                <input
                  type="number"
                  step="any"
                  name="cijena"
                  value={cijena}
                  onChange={(e) => setCijena(e.target.value)}
                  placeholder="Cena artikla"
                />
                {(error && cijena === 0) || (error && cijena === "") ? (
                  <div className="ui pointing red basic label">
                    Morate unijeti cijenu artikla
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
                {(error && Math.floor(kolicina) === 0) || ( error && cijena === "") ? (
                  <div className="ui pointing red basic label">
                    Morate unijeti kolicinu artikla
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
                  Morate unijeti opis artikla
                </div>
              ) : null}
            </div>
            <Button variant="contained" type="submit">
              Izmijenite artikal
            </Button>
          </form>
        </div>
      )}
    </>
  );
}