import React, {useState, useEffect} from "react";
import Timer from "./Timer";
import { GetProdavceveNovePorudzbine } from "../Services/PorudzbinaService";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ProdavacNovePorudzbine = () => {
    
    const [prodavceveNovePorudzbine, setProdavceveNovePorudzbine] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const getPorudzbine = async () =>{
            const prodavac = JSON.parse(sessionStorage.getItem('korisnik'));
            const prodavacId = prodavac.id;
            const token = sessionStorage.getItem('token'); 
            const response = await GetProdavceveNovePorudzbine(prodavacId, token);
    

            if(response !== null){
                setProdavceveNovePorudzbine(response);
                setLoading(false);

                if (response.length === 0) {
                    //console.log('Nema novih porudžbina.');
                    alert('Nema novih porudžbina.');
                    navigate('/prodavacDashboard');
                } else {
                    console.log(response);
                }
            }
          
        } 
        getPorudzbine();
    }, [])

    const prikaziDetaljePorudzbine = (id) => {
        navigate(`/detaljiProdavca/${id}`);
      };

    return (
        <div className="verification-container">
            <h2>Nove porudžbine koje sadrže moje artikle</h2>
            {loading && (
            <div className="loader-container">
              <div className="ui active inverted dimmer">
                <div className="ui large text loader">Ucitavanje porudzbina</div>
              </div>
            </div>
            )}
            {!loading && (
            
            <table className="ui fixed blue celled table" width={1000} style={{marginLeft: 16 + 'em'}}>
                <thead>
                    <tr>
                        <th>Id porudžbine</th>
                        <th>Adresa dostave</th>
                        <th>Cijena porudžbine</th>
                        <th>Preostalo vrijeme do isporuke</th>
                        <th>Detalji o elementima porudžbine</th>
                    </tr>
                </thead>
                <tbody>
                    {prodavceveNovePorudzbine.map((prodavcevaNovaPorudzbina) => (
                       <tr>
                            <td>
                                {prodavcevaNovaPorudzbina.id}
                            </td>
                            <td>
                                {prodavcevaNovaPorudzbina.adresaDostave}
                            </td>
                            <td className="center aligned"> 
                                {prodavcevaNovaPorudzbina.cijena} dinara
                            </td>
                            <td>
                                <Timer targetDate={prodavcevaNovaPorudzbina.vrijemeDostave}/>
                            </td>
                            <td>
                            <Button variant='contained' onClick={() => prikaziDetaljePorudzbine(prodavcevaNovaPorudzbina.id)}>Detalji</Button>

                            </td>
                       </tr>
                    ))}
                </tbody>
            </table>)}
        </div>
       );
}

export default ProdavacNovePorudzbine;