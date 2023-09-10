import { GetPorudzbinaById } from "../Services/PorudzbinaService.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const defaultTheme = createTheme();

const DetaljiPorudzbine = () => {
    const { id } = useParams(); 
    const [porudzbina, setPorudzbina] = useState({});
    const [loading, setLoading] = useState(true);
  
    const prodavac = JSON.parse(sessionStorage.getItem('korisnik'));
    const prodavacId = prodavac.id;

    const navigate = useNavigate();
  
    useEffect(() => {
      const getPordzbinaId = async () => {

        const response = await GetPorudzbinaById(id, sessionStorage.getItem('token'));
        if(response !== null){
          response.vrijemeDostave = new Date(response.vrijemeDostave);
          response.vrijemePorucivanja = new Date(response.vrijemePorucivanja);
          console.log(response)
          setPorudzbina(response);
          setLoading(false);
        }
      };
      getPordzbinaId();
    }, [id]);
  
  
    const handleClickPovratak = () => {
      const korisnik = JSON.parse(sessionStorage.getItem('korisnik'))
      if(korisnik.tipKorisnika === 'Kupac'){
        navigate('/kupacDashboard')
      }else if(korisnik.tipKorisnika === 'Prodavac'){
        navigate('/prodavacNovePorudzbine')
      }
     else if(korisnik.tipKorisnika === 'Administrator'){
      navigate('/svePorudzbineAdmin')
    }
    }
  
    return (
        <div className="card">
        {loading && (
          <div className="loader-container">
            <div className="ui active inverted dimmer">
              <div className="ui large text loader">Ucitavanje porudzbine</div>
            </div>
          </div>
          )}
        {!loading && ( <><h1 className="ui block blue center aligned header">
          Detalji porudžbine
        </h1>
        {porudzbina.id}
        <div className="field">
          <div className="ui blue message">
            <div className="ui green message">
              <h3 className="ui green center aligned header">Nazivi artikala</h3>
              <div className="ui green message" style={{marginRight: 37 + 'em', marginLeft:36 + 'em'}}>
              <ul className="ui large list">
                {porudzbina.imenaArtikala.map((ime) => (
                  <li className="item">{ime}</li>
                ))}
              </ul>
              </div>
            </div>
  
            <div className="field">
              <h3 className="ui blue center aligned header">
                Adresa dostave:
              </h3>
              {porudzbina.adresaDostave}
            </div>
            <div className="field">
              <h3 className="ui blue center aligned header">
                Datum i vrijeme poručivanja:{" "}
                </h3>
                {porudzbina.vrijemePorucivanja.toLocaleDateString()} u{" "}
                {porudzbina.vrijemePorucivanja.toLocaleTimeString()}
              
            </div>
            <div className="field">
              <h3 className="ui blue center aligned header">
                Datum i vrijeme dostave:
                </h3>
                 {porudzbina.vrijemeDostave.toLocaleDateString()} u{" "}
                {porudzbina.vrijemeDostave.toLocaleTimeString()}
              
            </div>
            <div className="field">
              <h3 className="ui blue center aligned header">
              
                Cijena porudžbine: 
                </h3>
                {porudzbina.cijena} dinara
            </div>
            <div className="field">
              <h3 className="ui blue center aligned header">
                Komentar:
                </h3>
                 {porudzbina.komentar}
              
            </div>
            <br />
          </div>
          <div className="field">
            <Button 
                type="submit"                
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleClickPovratak}>Povratak</Button>
          </div>
        </div>
        <br /></>)}
      </div>
      
    );
};
export default DetaljiPorudzbine;
