import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {CreatePorudzbina} from "../Services/PorudzbinaService.js";
import { Button } from "@mui/material";

export default function KupacPorudzbina() {
  const [adresaDostave, setAdresaDostave] = useState("");
  const [komentar, setKomentar] = useState("");
  const [error, setError] = useState(false);
  const [izabraniArtikli, setIzabraniArtikli] = useState(
    JSON.parse(sessionStorage.getItem("porudzbina"))
  );
  const [cijena, setCijena] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const ukupnaCijenaPorudzbine = () => {
      const cijeneDostavePoProdavcima = new Map(); // Mapa za čuvanje cijena dostave po prodavcima
      var ukupnaCijenaPorudzbine = 0;
  
      for (let i = 0; i < izabraniArtikli.length; i++) {
        const artikal = izabraniArtikli[i];
        
        if (cijeneDostavePoProdavcima.has(artikal.prodavacId)) {
          // Ako postoji, dodaj cijenu dostave na već postojeću
          cijeneDostavePoProdavcima.set(
            artikal.prodavacId,
            cijeneDostavePoProdavcima.get(artikal.prodavacId) + artikal.cijenaDostave
          );
        } else {
          // Ako ne postoji, postavi cijenu dostave za ovog prodavca
          cijeneDostavePoProdavcima.set(artikal.prodavacId, artikal.cijenaDostave);
        }
  
        ukupnaCijenaPorudzbine += artikal.kolicina * artikal.cijena;
      }
  
      // Dodaj cijene dostave za svakog prodavca na ukupnu cijenu porudžbine
      cijeneDostavePoProdavcima.forEach((cijenaDostave) => {
        ukupnaCijenaPorudzbine += cijenaDostave;
      });
  
      setCijena(ukupnaCijenaPorudzbine);
    };
  
    ukupnaCijenaPorudzbine();
  }, [izabraniArtikli]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const korisnik = JSON.parse(sessionStorage.getItem("korisnik"));
    const korisnikId = korisnik.id;

    const token = sessionStorage.getItem("token");

    if (adresaDostave.length === 0) {
      setError(true);
      return;
    }

    const elementiPorudzbine = [];
    for (let i = 0; i < izabraniArtikli.length; i++) {
      var porudzbinaArtikal = {
        idArtikal: izabraniArtikli[i].idArtikal,
        kolicina: izabraniArtikli[i].kolicina,
      };
      elementiPorudzbine.push(porudzbinaArtikal);
    }

    const porudzbinaDto = JSON.stringify({
      komentar,
      adresaDostave,
      korisnikId,
      elementiPorudzbine,
      cijena
    });

    
    const data = await CreatePorudzbina(porudzbinaDto, token);
    if(data !== null){
        console.log(data);
        alert("Vaša porudžbina je uspješno kreirana.");
        navigate('/kupacDashboard');
    
    } 
  };

  return (
    <div className="card">
      <form className="ui form" onSubmit={handleSubmit}>
        <h2 className="ui center aligned header">Potvrdite porudzbinu</h2>
        <div className="field">
          <div className="ui green message">
          <h3>Izabrani artikli</h3>
            <div className="ui green message" style={{marginRight: 43 + 'em', marginLeft:40 + 'em'}}>

            <ul className="list">
              {izabraniArtikli.map((izabraniArtikal) => (
                <li>{izabraniArtikal.kolicina} {izabraniArtikal.naziv} </li>
              ))}
            </ul>
            </div>
            <br />
            <h3 className="ui left aligned header">
              Cijena porudžbine:
              </h3>
               {cijena} dinara
            
          </div>
        </div>
        <br/>
        <div className="field">
          <h3>Adresa dostave</h3>
          <input
            type="text"
            name="adresaDostave"
            placeholder="Adresa dostave"
            value={adresaDostave}
            onChange={(e) => setAdresaDostave(e.target.value)}
          />
          {error && adresaDostave.length === 0 ? (
            <div className="ui pointing red basic label">
              Morate unijeti adresu dostave
            </div>
          ) : null}
        </div>
        <div className="field">
          <h3>Komentar</h3>
          <textarea
            className="textarea-resize"
            rows="6"
            placeholder="Unesite dodatne komentare, odnosno napomene"
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
          />
        </div>
        <Button    
            variant="contained"
            type="submit">
          Poruči
        </Button>
      </form>
    </div>
  );
}
