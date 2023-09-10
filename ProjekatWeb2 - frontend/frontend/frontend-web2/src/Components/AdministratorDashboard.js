import React from "react";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { createTheme, ThemeProvider } from '@mui/material/styles';
 
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup } from "@mui/material";
import { GetKorisnike } from "../Services/KorisnikService";
import { useState, useEffect } from "react";
const defaultTheme = createTheme();

    

const AdminDashboard = () => {

    const [korisnici, setKorisnici] = useState([]);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const getKorisnike = async () => {

            const data = await GetKorisnike(token);
            
            if(data !== null){
                setKorisnici(data);
            }
        }
        getKorisnike();
    }, []);

    return(
        <ThemeProvider theme={defaultTheme}>
            <h2 className="ui blue center aligned header">
            Uspješno ste prijavljeni na sistem u ulozi administratora
            </h2>
            <Box sx={{ display: 'main' }}>
                <Typography component="h2" variant="h5" color="primary">
                        Pregled svih korisnika sistema                    
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>                
                            <TableCell><h4>Fotografija</h4></TableCell>
                            <TableCell><h4>Ime</h4></TableCell>
                            <TableCell><h4>Prezime</h4></TableCell>
                            <TableCell><h4>Email</h4></TableCell>
                            <TableCell><h4>Korisničko ime</h4></TableCell>
                            <TableCell><h4>Adresa</h4></TableCell>
                            <TableCell><h4>Datum rodjenja</h4></TableCell>
                            <TableCell><h4>Tip korisnika</h4></TableCell>                           
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {korisnici.map((korisnik) => (
                        <TableRow>
                            <TableCell>
                            <img
                                alt="Fotografija"
                                className="ui big image"
                                src={korisnik.slika}
                                width="100"
                                height="150"
                            ></img>
                            </TableCell>
                            
                            <TableCell>{korisnik.ime}</TableCell>
                            <TableCell>
                                {korisnik.prezime}
                            </TableCell>
                            <TableCell>
                                {korisnik.email}
                            </TableCell>
                            <TableCell>
                                {korisnik.korisnickoIme}
                            </TableCell>
                            <TableCell>
                                {korisnik.adresa}
                            </TableCell>
                            <TableCell>
                                {korisnik.datumRodjenja}
                            </TableCell>
                            <TableCell>
                                {korisnik.tipKorisnika}
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Box>
        </ThemeProvider>

    );
}


export default AdminDashboard;