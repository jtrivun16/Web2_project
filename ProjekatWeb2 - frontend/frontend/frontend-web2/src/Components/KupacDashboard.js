import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllArticles } from "../Services/ArtikalService.js";
import {GetKupcevePorudzbine} from "../Services/PorudzbinaService.js"
import { OtkazivanjePorudzbine } from "../Services/PorudzbinaService.js";

import Timer from "./Timer"
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

const defaultTheme = createTheme();


const KupacDashboard = () => {
  const [artikli, setArtikli] = useState([]);
  const [izabraniArtikli, setIzabraniArtikli] = useState([]); //ovo su artikli koji sadrze id artikla i kolicinu koju korisnik hoce da poruic
  const [loading, setLoading] = useState(true);

  //koriste se za prikaz poruke i njen kontent
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState({
    type: "", //dal je pozitivna ili negativna poruka
    content: "",
  });
  const token = sessionStorage.getItem('token')

  const navigate = useNavigate();

  const [kupcevePorudzbine, setKupcevePorudzbine] = useState([]);

  useEffect(() => {
    const getPorudzbine = async () =>{
        const kupac = JSON.parse(sessionStorage.getItem('korisnik'));
        const idKupac = kupac.id;
        const token = sessionStorage.getItem('token'); 
        const response = await GetKupcevePorudzbine(idKupac, token);   
    
        if(response !== null){
            setKupcevePorudzbine(response);
            console.log(response)
            setLoading(false);
        }         
    } 
    getPorudzbine();
}, [])

const handleTimer = (vrijemeDostave, statusPorudzbine) => {
  if(statusPorudzbine === 'Otkazano'){
    return <td className="center aligned positive">
        /
    </td>
  }else{
    return<td className="center aligned positive">
        <Timer targetDate={vrijemeDostave}/>
    </td>
  }
}


const handleButtonCell = (datumKreiranja, id, statusPorudzbine) => {
    //pronadjem da li je od ovog trenutka proslo vise od sat vremena
    var oneHour = 60 * 60 * 1000; //60 min, 60 sek, 1000milisekundi
    var datumKreiranjaObject = new Date(datumKreiranja);
    var currentTime = new Date();
    var difference = currentTime.getTime() - datumKreiranjaObject.getTime()  


    if( (difference < oneHour) && (statusPorudzbine !== 'Otkazano')){
        return <td className="center aligned">
                    <Button className="mini ui red labeled icon button"
                            id={id} 
                            variant='contained'
                            onClick={(e) => handleOtkaziDugmeClick(e)}>
                        <i className="x icon"></i>
                        Otkažite porudžbinu
            </Button>
        </td> 
       
    }
    else {
      if(statusPorudzbine === 'Otkazano'){
        return <td className="center aligned positive">
        <i className="icon checkmark"></i>
        Porudžbina je otkazana
        </td>
      }else{
        return <td className="center aligned positive">
            <i className="icon checkmark"></i>
            Porudžbina je prihvaćena
        </td>
      }
    }
}



const handleOtkaziDugmeClick = async (e) => {
    e.preventDefault();
    const id = e.target.id;

    const response = await OtkazivanjePorudzbine(id, token)

    if(response !== null){
        //alert("Uspješno ste otkazali porudžbinu.");
        navigate('/kupacDashboard');
    }

}

  useEffect(() => {
    const getArtikle = async () => {
      setLoading(true);
      setShowMessage(false); //dok se ne ucitaju podaci, nema prikazivanja poruke
     
      const data = await GetAllArticles(token)
      if(data !== null){
        setArtikli(data);
        setLoading(false);
        setMessage({
          type: "positive",
          content: "Dobro došli na stranicu za online kupovinu. Prijavljeni ste u ulozi kupca.",
        });
        setShowMessage(true);
      } else{
        setLoading(true);
        setShowMessage(false);
      }       
    };
    getArtikle();
  }, []);

   //ovo moram jer pravi neki problem
  useEffect(() => {
    console.log(izabraniArtikli);
    //upisem u session storage
    //ovde je potrebno upisati u local storage, da bi se ya tog korisnika cuvao tacno ta porudzbina
    /*const korinsik = JSON.parse('korinsik')
    const korisnikId = korinsik.id;
    localStorage.setItem(`porudzbina ${korisnikId}`);*/
    sessionStorage.setItem("porudzbina", JSON.stringify(izabraniArtikli));
  }, [izabraniArtikli]);

  
  //napraviti dodatno dugme koje ce da stavlja niz artikala i kolicina u session storage i onda redirektuje na
  //dodavanje porudzbine

  //PROVERE, PROVERITI KOLICINU, I PISATI ALERTOVE KAD JE DODAT USPESNO ILI OBRISAN ARTIKAL
  //PROMENITI SA CARD NA TABLE

  const handleClickDodajArtikal = (e) => {
    //na ovaj nacin sam dobio unetu kolicinu ya taj konkretan element
    const idArtikal = parseInt(e.target.id);
    const artikal = artikli.find((artikal) => artikal.id === idArtikal);
    const unetaKolicina = document.getElementsByName(`input ${e.target.id}`)[0].value;

    //ako je nije uneta kolicina, onda se mora uneti
    if(unetaKolicina === ""){
      setMessage({
        type: "negative",
        content: "Morate unijeti količinu.",
      });
      alert("Morate unijeti količinu.")
    }
    else if(unetaKolicina <= artikal.kolicina){ //ako je uneta kolicina, proveri da li je manja od dostupne
      //na ovaj nacin omogucavam korisniku da moze da obrise artikal
      //document.getElementsByName(`izbaci ${e.target.id}`)[0].className = "ui red labeled icon button";

      //proveravam da li postoji objekat
      const isFound = izabraniArtikli.some((artikal) => {
        return artikal.idArtikal === idArtikal;
      });

      //ako postoji azuriram
      if (isFound) {
        setIzabraniArtikli((izabraniArtikal) => {
          const noviIzabraniArtikli = izabraniArtikal.map((obj) => {
            if (obj.idArtikal === idArtikal) {
              return { ...obj, kolicina: parseInt(unetaKolicina) };
            }
            return obj;
          });
          return noviIzabraniArtikli;
        });
        setMessage({
          type: "positive",
          content: `Uspješno ste ažurirali količinu artikla ${artikal.naziv}`,
        });
        alert(`Uspješno ste ažurirali količinu artikla ${artikal.naziv}`)
      } else {
        //ako ne postoji onda ga dodajem
        const noviIzabraniArtikal = {
          idArtikal: idArtikal,
          kolicina: parseInt(unetaKolicina),
          naziv: artikal.naziv,
          cijena: artikal.cijena,
          cijenaDostave: parseInt(artikal.cijenaDostave)
        };
        setIzabraniArtikli([...izabraniArtikli, noviIzabraniArtikal]);
        setMessage({
          type: "positive",
          content: `Uspješno ste dodali artikal ${artikal.naziv} u porudžbinu`,
        });
        alert(`Uspješno ste dodali artikal ${artikal.naziv} u porudžbinu`)
      }
    } else {
      setMessage({
        type: "negative",
        content: "Nema dovoljno dostupnih artikala",
      });
      alert("Nema dovoljno dostupnih artikala")
    }
  };

  const handleClickIzbaciArtikal = (e) => {

    //parsiram name da dobijem id
    const stringId = e.target.name.split(" ");
    const idArtikal = parseInt(stringId[1]); //parsiram u int
    const artikal = artikli.find((artikal) => artikal.id === idArtikal);

    //filter daje niz svih elemenata koji zadovoljavaju uslov
    //daje sve elemente koji ciji id nije tu i to je to
    setIzabraniArtikli(
      izabraniArtikli.filter(
        (izabraniArtikal) => izabraniArtikal.idArtikal !== idArtikal
      )
    );
    if(izabraniArtikli.length === 0){
      alert(`Niste izabrali artikal.`);
    }
    else
    {
    setMessage({
      type: "positive",
      content: `Uspješno ste izbacili artikal ${artikal.naziv} iz porudžbine.`,
    });
    document.getElementsByName(`input ${artikal.id}`)[0].value = "";
    alert(`Uspješno ste izbacili artikal ${artikal.naziv} iz porudžbine.`);
  }
  
  };

  const handlePoruci = () => {
    navigate("/kupacDashboard/kupacPorudzbina");
  } 

  const prikaziDetaljePorudzbine = (id) => {
    navigate(`/detalji/${id}`);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'main' }}>
      {loading && (
        <div className="loader-container">
          <div className="ui active inverted dimmer">
            <div className="ui large text loader">Učitavanje prodavaca</div>
          </div>
        </div>
      )}
      {!loading && (
        <div>
          {showMessage && (
            <div className={`ui large ${message.type} message`}>
              <div className="ui center aligned header"><h3>{message.content}</h3></div>
            </div>
          )}
           

        <Grid container spacing={2}>

            <Grid item xs={5}>
           <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            
           <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Dostupni artikli
            </Typography>

            <Table size="small">
            <TableHead>
                <TableRow>                
                    <TableCell><h4>Artikal</h4></TableCell>
                    <TableCell><h4>Opis artikla</h4></TableCell>
                    <TableCell><h4>Količina</h4></TableCell>
                    <TableCell><h4>Opcije</h4></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {artikli.map((artikal) => (
                <TableRow>
                    <TableCell>
                      <img
                        alt="Fotografija artikla"
                        className="ui big image"
                        src={artikal.fotografija}
                        width="100"
                        height="100"
                      ></img>
                      <div className="content">
                        Naziv: {artikal.naziv}
                        <div className="sub header">Cijena artikla: {artikal.cijena} dinara</div>
                        <div className="sub header">Dostupna količina: {artikal.kolicina}</div>
                        <div className="sub header">Cijena dostave: {artikal.cijenaDostave} dinara</div>
                      </div>
                    
                    </TableCell>
                      
                    <TableCell>{artikal.opis}</TableCell>
                    <TableCell><div className="field">
                      <input type="number"
                            placeholder="Unesite zeljenu kolicinu"
                            name={`input ${artikal.id}`}></input>
                    </div></TableCell>
                    <TableCell>
                      <ButtonGroup  orientation="vertical"
        aria-label="vertical outlined button group">
                        <Button className="buttonHeader"
                            id={artikal.id}
                            key="one"
                            variant='contained'
                            onClick={(e) => handleClickDodajArtikal(e)}>
                        Dodaj artikal
                        </Button> 
                    <br/>
                        <Button className="buttonHeader" 
                            name={`izbaci ${artikal.id}`}
                            key="two"
                            variant='contained'
                            disabled={artikal.kolicina === 0}
                            onClick={(e) => handleClickIzbaciArtikal(e)}>
                        Izbaci artikal
                        </Button>
                        </ButtonGroup>
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
          <Button 
                disabled={izabraniArtikli.length === 0}
                variant='contained'
                className='headerButton'
                onClick={handlePoruci}>
            Poruči izabrane artikle
          </Button>
          </Paper>

          </Grid>
       


            <Grid item xs={7}>
           <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            
           <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Moje prethodne porudžbine
            </Typography>

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
                {kupcevePorudzbine.map((kupcevaPorudzbina) => (
                <TableRow>
                    <TableCell><h4 className="ui header">
                               {kupcevaPorudzbina.id}
                            </h4>
                    </TableCell>
                    <TableCell>
                      <Button variant='contained' onClick={() => prikaziDetaljePorudzbine(kupcevaPorudzbina.id)}>Detalji</Button>
                    </TableCell>
                    <TableCell>{kupcevaPorudzbina.adresaDostave}</TableCell>
                    <TableCell>
                    {kupcevaPorudzbina.cijena} dinara
                    </TableCell>
                    <TableCell>
                        {handleTimer(kupcevaPorudzbina.vrijemeDostave, kupcevaPorudzbina.statusPorudzbine)}
                    </TableCell>
                    {handleButtonCell(kupcevaPorudzbina.vrijemePorucivanja, kupcevaPorudzbina.id, kupcevaPorudzbina.statusPorudzbine)}
                    </TableRow>
                ))}
            </TableBody>
          </Table>
          
          </Paper>

          </Grid>

          </Grid>         
        </div>
        
      )}
      </Box>
    </ThemeProvider>
  );
};

export default KupacDashboard;
