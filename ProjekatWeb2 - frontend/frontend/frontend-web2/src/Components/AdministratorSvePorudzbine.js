import React,{useState, useEffect} from "react";
import { GetAllPorudzbine } from "../Services/PorudzbinaService";
import Timer from "./Timer";
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
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();


const AdminSvePorudzbine = () => {
    const [adminovePorudzbine, setAdminovePorudzbine] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getPorudzbine = async () =>{
            
            const token = sessionStorage.getItem('token'); 
            const response = await GetAllPorudzbine(token);

            if(response !== null){
                setAdminovePorudzbine(response);
                console.log(response)
                setLoading(false);
            }
          
        } 
        getPorudzbine();
    }, [])

    const prikaziDetaljePorudzbine = (id) => {
        navigate(`/detalji/${id}`);
      };

    const handleTimer = (vrijemeDostave, statusPorudzbine) => {
        if(statusPorudzbine === 'Otkazano'){
          return <td className="center aligned positive">
              Porudžbina je otkazana
          </td>
        }else{
          return<td className="center aligned positive">
              <Timer targetDate={vrijemeDostave}/>
          </td>
        }
      }

    return (
        <ThemeProvider theme={defaultTheme}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
             Sve porudžbine
            </Typography>

        <Box sx={{ display: 'flex' }}>
            <Table size="small">
            <TableHead>
                <TableRow>                
                    <TableCell><h4>Id porudžbine</h4></TableCell>
                    <TableCell><h4>Artikli u porudžbini</h4></TableCell>
                    <TableCell><h4>Adresa dostave</h4></TableCell>
                    <TableCell><h4>Cijena porudžbine</h4></TableCell>
                    <TableCell><h4>Vrijeme do isporuke</h4></TableCell>
                    <TableCell><h4>Status porudžbine</h4></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {adminovePorudzbine.map((adminovaPorudzbina) => (
                <TableRow>
                    <TableCell><h4 className="ui header">
                               {adminovaPorudzbina.id}
                            </h4>
                    </TableCell>
                    <TableCell>
                      <Button variant='contained' onClick={() => prikaziDetaljePorudzbine(adminovaPorudzbina.id)}>Detalji</Button>
                    </TableCell>
                    <TableCell>
                        {adminovaPorudzbina.adresaDostave}
                    </TableCell>
                    <TableCell>
                        {adminovaPorudzbina.cijena} dinara
                    </TableCell>
                    <TableCell>
                        {handleTimer(adminovaPorudzbina.vrijemeDostave, adminovaPorudzbina.statusPorudzbine)}
                    </TableCell>
                    <TableCell>
                         {adminovaPorudzbina.statusPorudzbine}            
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
        </ThemeProvider>
       );
}


export default AdminSvePorudzbine;
