import React, { useState } from "react";
import { AddArtikal } from "../Services/ArtikalService";
import UserImage from "./UserImage";
import productImage from "../Images/product.jpg";
import { Button } from "@mui/material";

const ProdavacNoviArtikal = () => {
   
    const [error, setError] = useState(false);
    const [naziv, setNaziv] = useState('');
    const [cena, setCena] = useState(0);
    const [kolicina, setKolicina] = useState(0); 
    const [opis, setOpis] = useState('');
    const [fotografija, setFotografija] = useState(productImage);
    

    const setInputsToEmpty = () => {
        setNaziv('');
        setCena(0);
        setKolicina(0);
        setOpis('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(naziv, cena, kolicina, opis);
        const prodavac = JSON.parse(sessionStorage.getItem('korisnik'));
        const token = sessionStorage.getItem('token');
        const prodavacId = prodavac.id;
        const cenaDostave = prodavac.cenaDostave;

        if(naziv.length === 0 || cena === 0 || cena === "" || kolicina === "" || Math.floor(kolicina) === 0
        || opis.length === 0 || fotografija.length === 0){
            setError(true);
            return;
        }

        const artikalDto = JSON.stringify({
            naziv, cena, kolicina, opis, fotografija, prodavacId, cenaDostave
        });

        const data = await AddArtikal(artikalDto, token);
        if(data !== null){
            
            setInputsToEmpty();
            alert("Artikal je uspešno dodat.")
            console.log(data)
        }else{
            setInputsToEmpty();
        }
    }

    return (
        <div className="card">
            <form className="ui form" onSubmit={handleSubmit} >
                <h2 className="ui center aligned header">Kreiraj novi artikal</h2>
                <UserImage slika={fotografija} setSlika={setFotografija}></UserImage>
                {error && fotografija.length === 0 ? <div className="ui pointing red basic label">Morate izabrati fotografiju.</div> : null}
                <div className="field">
                    <h4>Naziv artikla</h4>
                    <input  type="text" 
                            name="naziv"
                            placeholder="Naziv artikla"
                            value={naziv}
                            onChange={(e) => setNaziv(e.target.value)}
                            />
                    {error && naziv.length === 0 ? <div className="ui pointing red basic label">Morate uneti naziv artikla.</div> : null}
                </div>
                <div className="two fields">
                    <div className="field">
                        <h4>Cena artikla</h4>
                        <input  type="number" 
                                step="any"
                                name="cena"
                                value={cena}
                                onChange={(e) => setCena(e.target.value)}
                                placeholder="Cena artikla"
                                />
                        {(error && cena === 0) || (error && cena === "") ? <div className="ui pointing red basic label">Morate uneti cenu artikla.</div> : null}
                    </div>
                    <div className="field">
                        <h4>Količina artikla</h4>
                        <input  type="number"
                                step="1"
                                name="kolicina"
                                value={kolicina}
                                onChange={(e) => setKolicina(e.target.value)}
                                placeholder="Kolicina artikla"
                        />
                        {(error && Math.floor(kolicina) === 0) || ( error && cena === "") ? <div className="ui pointing red basic label">Morate uneti količinu artikla.</div> : null}
                    </div>
                </div>
                <div className="field">
                    <h4>Opis</h4>
                    <textarea className="textarea-resize"
                              rows="6" 
                              placeholder="Unesite opis artikla"
                              value={opis}
                              onChange={(e) => setOpis(e.target.value)}
                    /> 
                    {error && opis.length === 0 ? <div className="ui pointing red basic label">Morate uneti opis artikla.</div> : null}
                </div>
                <Button variant="contained" type="submit">Dodaj artikal</Button>
            </form>
        </div>
    );
}

export default ProdavacNoviArtikal;