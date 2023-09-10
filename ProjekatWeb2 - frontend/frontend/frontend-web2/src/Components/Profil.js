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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { RegisterUser } from "../Services/KorisnikService";
import jwt_decode from 'jwt-decode';


import { getKorisnikId, IzmijeniProfil } from '../Services/KorisnikService';
import { Link, useParams } from 'react-router-dom';

import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage";

const defaultTheme = createTheme();


const Profil = () => {
  const korisnik = JSON.parse(sessionStorage.getItem("korisnik"));


  const id = korisnik.id;
  const tipKorisnika = korisnik.tipKorisnika;
  const verifikacijaProdavca = korisnik.verifikacijaProdavca;
  const [korisnickoIme, setKorisnickoIme] = useState(korisnik.korisnickoIme);
  const [email, setEmail] = useState(korisnik.email);
  const [lozinka, setLozinka] = useState(korisnik.lozinka);
  const [ime, setIme] = useState(korisnik.ime);
  const [prezime, setPrezime] = useState(korisnik.prezime);
  const [datumRodjenja, setDatumRodjenja] = useState(
    new Date(korisnik.datumRodjenja)
  );
  const [adresa, setAdresa] = useState(korisnik.adresa);
  const [cenaDostave, setCenaDostave] = useState(korisnik.cijenaDostave);
  const [slika, setSlika] = useState(korisnik.slika);

  const navigate = useNavigate();

  const [error, setError] = useState(false);

  const redirectTo = (tipKorisnika) => {
    if (tipKorisnika === "Admin") {
      navigate("/adminDashboard");
    } else if (tipKorisnika === "Kupac") {
      navigate("/kupacDashboard");
    } else if (tipKorisnika === "Prodavac") {
      navigate("/prodavacDashboard");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      korisnickoIme.length === 0 ||
      email.length === 0 ||
      lozinka.length === 0 ||
      ime.length === 0 ||
      prezime.length === 0 ||
      datumRodjenja === null ||
      adresa.length === 0 || 
      slika.length === 0
    ) {
      setError(true);
      return;
    }

    const updatedKorisnikJSON = JSON.stringify({
      korisnickoIme,
      email,
      lozinka,
      ime,
      prezime,
      datumRodjenja,
      tipKorisnika,
      adresa,
      verifikacijaProdavca,
      cenaDostave,
      slika
    });

    const token = sessionStorage.getItem("token");

    const data = await IzmijeniProfil(updatedKorisnikJSON, id, token)
    if (data !== null) {
      sessionStorage.setItem("korisnik", JSON.stringify(data));
      alert("Uspješno ste izmijenili podatke.");
      redirectTo(tipKorisnika);
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
             Podaci o korisniku
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                  <UserImage slika={slika} setSlika={setSlika}></UserImage>   
                  {error && slika.length === 0 ? <div className="ui pointing red basic label">Morate odabrati sliku</div> : null} 
                </Grid>
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
                    disabled
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

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Izmijeni
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
  );
};

export default Profil;
