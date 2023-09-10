import { GetPrethodnePorudzbineProdavac } from '../Services/PorudzbinaService';
import React, {useState, useEffect} from "react";
import Timer from './Timer';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ProdavacPrethodnePorudzbine = () => {
    const [prodavceveMojePorudzbine, setProdavceveMojePorudzbine] = useState([]);
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();

    useEffect(() => {
        const getPorudzbine = async () =>{
            const prodavac = JSON.parse(sessionStorage.getItem('korisnik'));
            const prodavacId = prodavac.id;
            const token = sessionStorage.getItem('token'); 
            const response = await GetPrethodnePorudzbineProdavac(prodavacId, token);

            if(response !== null){
                setProdavceveMojePorudzbine(response);
                setLoading(false);
                if (response.length === 0) {
                    alert('Nema prethodnih porudžbina.');
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
            <h2>Prethodne porudzbine koje su sadrzale moje artikle</h2>
            {loading && (
            <div className="loader-container">
              <div className="ui active inverted dimmer">
                <div className="ui large text loader">Ucitavanje porudzbina</div>
              </div>
            </div>
            )}
            {!loading && (<table className="ui fixed blue celled table">
                <thead>
                    <tr>
                        <th>Id porudzbine</th>
                        <th>Adresa dostave</th>
                        <th>Cijena porudzbine</th>
                        <th>Vreme ostalo do isporuke</th>
                        <th>Detalji o elementima porudzbine</th>

                    </tr>
                </thead>
                <tbody>
                    {prodavceveMojePorudzbine.map((prodavcevaMojaPorudzbina) => (
                       <tr>
                            <td>
                                
                            {prodavcevaMojaPorudzbina.id}
                                
                            </td>
                            <td>
                                {prodavcevaMojaPorudzbina.adresaDostave}
                            </td>
                            <td className="center aligned"> 
                                {prodavcevaMojaPorudzbina.cijena} dinara
                            </td>
                            <td>
                                <Timer targetDate={prodavcevaMojaPorudzbina.vrijemeDostave}/>
                            </td>
                            <td>
                            <Button variant='contained' onClick={() => prikaziDetaljePorudzbine(prodavcevaMojaPorudzbina.id)}>Detalji</Button>

                            </td>
                       </tr>
                    ))}
                </tbody>
            </table>)}
        </div>
       );
}

export default ProdavacPrethodnePorudzbine;