import React from "react";
import Typography from '@mui/material/Typography';

  
const Home = () => {
    return (
       <div>
        
        <Typography component="h1" variant="h3">
           Dobro došli!
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