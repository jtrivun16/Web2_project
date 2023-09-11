import React from "react";
import Typography from '@mui/material/Typography';

  
const Home = () => {
    return (
       <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Postavljamo visinu na 100% visine ekrana
        marginTop: '-20vh', // Dodajemo 20% visine ekrana na vrh
      }}>
        
        <Typography component="h1" variant="h3">
           Dobro došli u SVET KROFNI!
        </Typography>
        <p></p>
        <Typography component="h1" variant="h5">
            Ukoliko ste već registrovani, izaberite opciju Log In. 
            <p></p>
            Ukoliko niste registrovani, izaberite opciju Registration.
        </Typography>
       </div>
    );
}

export default Home;