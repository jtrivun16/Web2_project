import * as React from 'react';
import { useState, useEffect} from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Link} from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import UserImage from '../UserImage';
import image from "../../Images/camera.png";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { RegisterUser } from "../../Services/KorisnikService";
import jwt_decode from 'jwt-decode';
import imageUrl from "../../Images/camera.png";

import {prijavaPrekoGoogle} from '../../Services/KorisnikService';
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";


const defaultTheme = createTheme();

const Registration = ({handleKorisnikInfo}) => {

  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId:
        "499389954872-f3pheoj58rf46vvq8reuglnsq77llga5.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });

    const [korisnickoIme, setKorisnickoIme] = useState('');
    const [email, setEmail] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [lozinka2, setLozinka2] = useState('');
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [datumRodjenja, setDatumRodjenja] = useState(null);
    const [tipKorisnika, setTipKorisnika] = useState('Kupac');
    const [adresa, setAdresa] = useState('')
    const [statusVerifikacije, setStatusVerifikacije] = useState('Prihvacen');
    const [cijenaDostave, setCijenaDostave] = useState(0);
    const [slika, setSlika] = useState(imageUrl);

    const navigate = useNavigate();

    const[error, setError] = useState(false);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
      
        //uraditi provere za lozinke, tj. da li se prva i druga poklapaju i da li su uneta stva polja

        if(korisnickoIme.length === 0 || email.length === 0 || lozinka.length === 0 || lozinka2.length === 0 
            || ime.length === 0 || prezime.length === 0 || datumRodjenja === null || adresa.length === 0 || lozinka !== lozinka2
            || (cijenaDostave === 0 && tipKorisnika === 'Prodavac') || slika.length === 0){
                setError(true);
                return;
            }


        if(lozinka === lozinka2){
            const korisnikJSON = JSON.stringify({
                korisnickoIme,
                email,
                lozinka,
                ime,
                prezime,
                datumRodjenja,
                tipKorisnika,
                adresa,
                statusVerifikacije, 
                cijenaDostave,
                slika
            });

        }
        
        const korisnikJSON = JSON.stringify({
            korisnickoIme,
            email,
            lozinka,
            ime,
            prezime,
            datumRodjenja,
            tipKorisnika,
            adresa,
            statusVerifikacije, 
            cijenaDostave,
            slika});

         const setInputsToEmpty = () => {
                setKorisnickoIme('');
                setEmail('');
                setLozinka('');
                setLozinka2('');
                setIme('');
                setPrezime('');
                setDatumRodjenja('');
                setTipKorisnika('Kupac');
                setStatusVerifikacije('Prihvacen');
                setAdresa('');
                setCijenaDostave('');
        }

        const redirectTo = (tipKorisnika) => {
            if(tipKorisnika === 'Admin'){
                navigate('/adminDashboard');
            }
            else if(tipKorisnika === 'Kupac'){
                navigate('/kupacDashboard');
            }
            else if(tipKorisnika === 'Prodavac'){
                navigate('/prodavacDashboard');
            }
        }

        const data = await RegisterUser(korisnikJSON);
        if(data !== null){
            sessionStorage.clear();
            sessionStorage.setItem('isAuth', JSON.stringify(true));
            sessionStorage.setItem('token', data.token)
            sessionStorage.setItem('korisnik', JSON.stringify(data.korisnikDto));
            handleKorisnikInfo(true); //prvo se postave podaci pa se re reneruje
            alert("Uspješna registracija.");
            redirectTo(tipKorisnika);

        } else {
            setInputsToEmpty();
            sessionStorage.setItem('isAuth', JSON.stringify(false));
            handleKorisnikInfo(false);
        }    
    };  
    
    
    const responseGoogle = (response) => {
      console.log(response);
      handlePrijava(response);
  }

    const handlePrijava = async (data) => {
      try {
        const LogObject={idToken:data.tokenId};

        const response = await prijavaPrekoGoogle(LogObject);
        localStorage.setItem('token', response.data);
        sessionStorage.setItem('isAuth', JSON.stringify(true));
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('korisnik', JSON.stringify(response.korisnikDto));
        handleKorisnikInfo(true);
        alert("Uspješno ste se prijavili preko Google naloga.");
        navigate('/kupacDashboard');      
       
      } catch (error) {
        console.log(error);
        sessionStorage.setItem("isAuth", false);
        handleKorisnikInfo(false); //prvo se postave podaci pa se re reneruje
        setError([error.message]);
      }
    };


    return (
        <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            
            <Typography component="h1" variant="h5">
             Registracija
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="ime"
                    required
                    fullWidth
                    id="ime"
                    label="Ime"
                    value={ime}
                    onChange={(e) => setIme(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Prezime"
                    name="lastName"
                    value={prezime}
                    onChange={(e) => setPrezime(e.target.value)}
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Korisiničko ime"
                    name="korisnickoIme"  
                    value={korisnickoIme}
                    onChange={(e) => setKorisnickoIme(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email "
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                          <label>Datum Rodjenja</label>
                          <DatePicker 
                              showIcon
                              selected={datumRodjenja}
                              onChange={datum => setDatumRodjenja(datum)}
                              dateFormat="dd/MM/yyyy"
                              showYearDropdown
                              scrollableMonthYearDropdown
                          />
                          {error && datumRodjenja === null ? <div className="ui pointing red basic label">Morate izabrati datum rodjenja</div> : null}
  
                </Grid>
                <Grid item xs={12} sm={6}>
                          <label>Tip korisnika</label>
                          <Select value={tipKorisnika} className="ui fluid dropdown" onChange={(e) => setTipKorisnika(e.target.value)}>
                              <MenuItem value="Kupac">Kupac</MenuItem>
                              <MenuItem value="Prodavac">Prodavac</MenuItem>
                        </Select>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="adresa"
                    label="Adresa"
                value={adresa}
                    onChange={(e) => setAdresa(e.target.value)}
                    name="adresa"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="lozinka"
                    label="Lozinka"
                    type="password"
                    id="password"
                value={lozinka}
                    onChange={(e) => setLozinka(e.target.value)}
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="lozinka2"
                    label="Ponovi lozinku"
                    type="password"
                    id="password2"
                value={lozinka2}
                   onChange={(e) => setLozinka2(e.target.value)}
                    autoComplete="new-password"
                  />
                </Grid>
      {error && lozinka !== lozinka2  ? 
                          <div className="field">
                              <div className="ui pointing red basic label">Lozinke se moraju poklapati</div>
                          </div>
                      : null}
                <Grid item xs={12}>
                  <UserImage slika={slika} setSlika={setSlika}></UserImage>   
                  {error && slika.length === 0 ? <div className="ui pointing red basic label">Morate odabrati sliku</div> : null} 
                </Grid> 
                {tipKorisnika === "Prodavac" ? 
                          <Grid item xs={12}>
                              <label>Potrebno je unijeti cijenu dostave</label>
                              <TextField
                                      required
                                      fullWidth
                                      name="cijenaDostave" 
                                      placeholder="Cijena dostave"
                                      value={cijenaDostave}
                                      type="number" 
                                      onChange={(e) => setCijenaDostave(e.target.value)}
                              />
                              {error && cijenaDostave === "" ? <div className="ui pointing red basic label">Unesite cijenu dostave</div> : null}
                          </Grid>
                              : null}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Registracija
              </Button>
              <br/>
                  
              <GoogleLogin
              clientId="499389954872-f3pheoj58rf46vvq8reuglnsq77llga5"
              buttonText="Registruj se putem Google naloga"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              scope="profile"
              />
              <br/>
              <br/>
              <Link to="/login"> Već imate nalog? Prijavite se </Link>

            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
}

export default Registration;