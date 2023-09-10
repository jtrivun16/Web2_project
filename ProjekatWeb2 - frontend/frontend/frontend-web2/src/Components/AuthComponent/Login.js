import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Link} from "react-router-dom";
import { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../Services/KorisnikService";
import jwt_decode from 'jwt-decode';
import { gapi } from "gapi-script";

import { GoogleOAuthProvider } from '@react-oauth/google';
import {prijavaPrekoGoogle} from '../../Services/KorisnikService';
import GoogleLogin from "react-google-login";

const defaultTheme = createTheme();

const Login = ({handleKorisnikInfo}) => {

  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId:
        "499389954872-f3pheoj58rf46vvq8reuglnsq77llga5.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });

    const[email, setEmail] = useState('');
    const[lozinka, setLozinka] = useState('');
    const[error, setError] = useState(false);
    
    const navigate = useNavigate();

    //const[google, setGoogle] = useState(window.google);
    
    const handleSubmit = async (event) => {
      event.preventDefault();

      if(email.length === 0 || lozinka.length === 0){
        setError(true)
        return;
        }

        //console.log("Token: " + response.credential);

        //var userObject = jwt_decode(response.credential)
       // var email = userObject.email;
       // var lozinka = userObject.email;


        
        const setInputsToEmpty = () => {
            setEmail('');
            setLozinka(''); 
        }



        const redirectTo = (tipKorisnika) => {
            if(tipKorisnika === 'Administrator'){
                navigate('/administratorDashboard');
            }
            else if(tipKorisnika === 'Kupac'){
                navigate('/kupacDashboard');
            }
            else if(tipKorisnika === 'Prodavac'){
                navigate('/prodavacDashboard');
            }
        }

        const data = await LoginUser(email, lozinka);
        if(data !== null){
            sessionStorage.setItem("isAuth", JSON.stringify(true));
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("korisnik", JSON.stringify(data.korisnikDto));
            const tipKorisnika = data.korisnikDto.tipKorisnika; // propertiji su mala slova
            handleKorisnikInfo(true); //prvo se postave podaci pa se re reneruje
            alert("Uspješno logovanje.");
            redirectTo(tipKorisnika);
        }
        else{
            
            sessionStorage.setItem("isAuth", false);
            handleKorisnikInfo(false); //prvo se postave podaci pa se re reneruje
            setInputsToEmpty();
        }
      
    }

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
            alert("Uspesno ste se ulogovali preko Google naloga.");
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
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                 Log In 
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email} 
                onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                value={lozinka}
                    autoComplete="current-password"
                onChange={(e) => setLozinka(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Log In
                  </Button>
                  
              <GoogleLogin
              clientId="499389954872-f3pheoj58rf46vvq8reuglnsq77llga5"
              buttonText="Uloguj se putem Google naloga"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              scope="profile"
              />
              <br/>
              <br/>
                  <Link to="/registration"> Nemate nalog? Registruj se </Link>
                  <div id="signInDiv"></div>
                </Box>
              </Box>
      
            </Container>
          </ThemeProvider>
   );
}

export default Login;