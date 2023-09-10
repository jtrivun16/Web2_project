import axios from 'axios';
import IspisModel from "../Models/IspisModel";
import KorisnikModel from '../Models/KorisnikModel';

const baseUrl = process.env.REACT_APP_API_BACKEND;


export const prijavaPrekoGoogle = async (UserLoginDto) => {
    try {
  
      const {data} = await axios.post(`${baseUrl}/users/loginExternal`, UserLoginDto);
  
      const odgovor = new IspisModel(data);
      return odgovor;
    }
    catch(error)
    {
      console.error(error);
      throw new Error('Greška prilikom prijave korisnika preko Google naloga.');
    }
  };

export const LoginUser = async (email, lozinka) => {
    //const url_login = "users/login";

    try {
        const {data} = await axios.post(`${baseUrl}/users/login`,
        JSON.stringify({ email, lozinka }),
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }
        );
        const odgovor = new IspisModel(data);
        return odgovor;
    } catch(error){
        alert("Greska pri logovanju");
        return null;
    }
}

export const RegisterUser = async (korisnikJSON) => {
    try{
        const {data} = await axios.post(`${baseUrl}/users/registration`,
            korisnikJSON,
            {
                headers:{'Content-Type' : 'application/json'},
                withCredentials: true
            }
        );
        const response = new IspisModel(data);
        return response;
    }catch(err){
        alert("Nesto se desilo prilikom registracije");
        return null;
    }
}

export const IzmijeniProfil = async (updatedKorisnikJSON, id, token) => {
    try{
        const {data} = await axios.put(`${baseUrl}/users/${id}`, updatedKorisnikJSON,
            {
                headers: 
                {
                    'Content-Type' : 'application/json',
                    'Authorization' : token
                },
                withCredentials: true
            }
        );
        //const izmijenjenKorisnik = new KorisnikModel(data);
        const updatedKorisnik = new KorisnikModel(data);
        return updatedKorisnik;
    }catch(err){
        console.log(err);
        alert("Nesto se desilo prilikom izmjene podataka")
    }
}

export const getKorisnikId = async (id) => {
    try {
      const {data} = await axios.get(`${baseUrl}/users/${id}`);
      const response = new KorisnikModel(data);
        return response;
    } catch (error) {
      console.error(error);
      throw new Error('Greska prilikom dobavljanja informacija o korisniku.');
    }
  };


  export const GetProdavce = async (token) => {
    try{
        const {data} = await axios.get(
            `${baseUrl}/users/getProdavci`,
            {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
            }
        );
        const prodavci = data.map(prodavac => {
            return new KorisnikModel(prodavac);
        })
        return prodavci;
    }catch(err){
        console.log(err);
        alert("Nesto se desilo prilikom dobavljanja prodavaca");
        return null;
    }
}

export const GetKorisnike = async (token) => {
    try{
        const {data} = await axios.get(
            `${baseUrl}/users`,
            {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
            }
        );
        const korisnici = data.map(korisnik => {
            return new KorisnikModel(korisnik);
        })
        return korisnici;
    }catch(err){
        console.log(err);
        alert("Nesto se desilo prilikom dobavljanja prodavaca");
        return null;
    }
}

export const VerifyProdavca = async (prodavacId, buttonType, token) =>{
    try{
        const {data} = await axios.put(
            `${baseUrl}/users/verifyProdavca/${prodavacId}`,
            buttonType,
            {
                headers:{
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        const verifikovaniProdavci = data.map(verifikovanProdavac => {
            return new KorisnikModel(verifikovanProdavac);
        })
        return verifikovaniProdavci;
    }catch(err){
        console.log(err);
        alert("Nesto se desilo prilikom verifikacije prodavca");
        return null;
    }

}