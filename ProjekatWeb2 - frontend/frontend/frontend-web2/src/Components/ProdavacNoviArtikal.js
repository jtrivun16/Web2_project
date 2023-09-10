import React, { useState } from "react";
import { AddArtikal } from "../Services/ArtikalService";
import UserImage from "./UserImage";
import productImage from "../Images/product.jpg";
import { Button } from "@mui/material";

const ProdavacNoviArtikal = () => {
   
    const [error, setError] = useState(false);
    const [naziv, setNaziv] = useState('');
    const [cijena, setCijena] = useState(0);
    const [kolicina, setKolicina] = useState(0); 
    const [opis, setOpis] = useState('');
    const [fotografija, setFotografija] = useState(productImage);
    

    const setInputsToEmpty = () => {
        setNaziv('');
        setCijena(0);
        setKolicina(0);
        setOpis('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(naziv, cijena, kolicina, opis);
        const prodavac = JSON.parse(sessionStorage.getItem('korisnik'));
        const token = sessionStorage.getItem('token');
        const prodavacId = prodavac.id;
        const cijenaDostave = prodavac.cijenaDostave;

        if(naziv.length === 0 || cijena === 0 || cijena === "" || kolicina === "" || Math.floor(kolicina) === 0
        || opis.length === 0 || fotografija.length === 0){
            setError(true);
            return;
        }

        const artikalDto = JSON.stringify({
            naziv, cijena, kolicina, opis, fotografija, prodavacId, cijenaDostave
        });

        const data = await AddArtikal(artikalDto, token);
        if(data !== null){
            
            setInputsToEmpty();
            alert("Artikal je uspješno dodat.")
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
                    {error && naziv.length === 0 ? <div className="ui pointing red basic label">Morate unijeti naziv artikla.</div> : null}
                </div>
                <div className="two fields">
                    <div className="field">
                        <h4>Cijena artikla</h4>
                        <input  type="number" 
                                step="any"
                                name="cijena"
                                value={cijena}
                                onChange={(e) => setCijena(e.target.value)}
                                placeholder="Cijena artikla"
                                />
                        {(error && cijena === 0) || (error && cijena === "") ? <div className="ui pointing red basic label">Morate unijeti cijenu artikla.</div> : null}
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
                        {(error && Math.floor(kolicina) === 0) || ( error && cijena === "") ? <div className="ui pointing red basic label">Morate unijeti količinu artikla.</div> : null}
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
                    {error && opis.length === 0 ? <div className="ui pointing red basic label">Morate unijeti opis artikla.</div> : null}
                </div>
                <Button variant="contained" type="submit">Dodaj artikal</Button>
            </form>
        </div>
    );
}

export default ProdavacNoviArtikal;