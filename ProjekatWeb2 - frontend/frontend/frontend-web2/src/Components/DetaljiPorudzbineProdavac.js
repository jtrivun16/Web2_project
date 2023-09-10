import React, { useEffect, useState } from 'react';
import { GetArtiklePorudzbineProdavca } from '../Services/PorudzbinaService';
import { Link, useParams } from 'react-router-dom';

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

const defaultTheme = createTheme();

const Detalji = ({ match }) => {
  const [artikli, setArtikli] = useState([]);
  const { id } = useParams(); // Preuzimanje porudžbine ID iz rute

  const prodavac = JSON.parse(sessionStorage.getItem('korisnik'));
  const prodavacId = prodavac.id;
  

  useEffect(() => {
    const get = async () => {
      try {
        const resp = await GetArtiklePorudzbineProdavca(id, prodavacId, sessionStorage.getItem('token'));
        console.log(resp);
        console.log(resp);
        setArtikli(resp); 
       
        
      } catch (error) {
        console.error('Greska prilikom dobavljanja artikala porudzbine:', error);
      }
    };
    get();
  }, [id]);


  return (
    <ThemeProvider theme={defaultTheme}>
                <Box sx={{ display: 'main' }}>

            <Typography component="h2" variant="h6" color="primary" gutterBottom>
             Moji artikli u porudžbini
            </Typography>

            <Table size="small">
            <TableHead>
                <TableRow>                
                    <TableCell><h4>Id artikla</h4></TableCell>
                    <TableCell><h4>Naziv</h4></TableCell>
                    <TableCell><h4>Cijena</h4></TableCell>
                    <TableCell><h4>Opis</h4></TableCell>
                    <TableCell><h4>Fotografija</h4></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {artikli.map((artikal) => (
                <TableRow>
                    <TableCell><h4 className="ui header">
                    {artikal.id}
                            </h4>
                    </TableCell>
                    <TableCell>
                    {artikal.naziv}
                                        </TableCell>
                    <TableCell>
                    {artikal.cijena} dinara
                    </TableCell>
                    <TableCell>
                    {artikal.opis}
                    </TableCell>
                    <TableCell>
                    <img
                        className="ui big image"
                        src={artikal.fotografija}
                        width="200"
                        height="100"
                      ></img>
                                          </TableCell>

                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
        </ThemeProvider>
    
  );
};

export default Detalji;
