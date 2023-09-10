import axios from "axios";
import PorudzbinaModel from "../Models/PorudzbinaModel";
import OtkazivanjePorudzbineModel from "../Models/OtkazivanjePorudzbineModel";
import PregledPorudzbineModel from "../Models/PregledPorudzbineModel";

const baseUrl = process.env.REACT_APP_API_BACKEND;


export const GetKupcevePorudzbine = async (idKupac, token) => {
    try {
        console.log(token)
        console.log(idKupac)
      const {data} = await axios.get(`${baseUrl}/orders/getKupcevePorudzbine/${idKupac}`,
      {
          headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}`
          },
          withCredential: true
      });
      const svePorudzbine = [];
      for(var i = 0; i < data.length; i++){
          var porudzbina = new PorudzbinaModel(data[i]);
          porudzbina.addAllArtiklePorudzbine(data[i].elementiPorudzbine);
          svePorudzbine.push(porudzbina);
      }
      return svePorudzbine;
    } catch (error) {
      console.error(error);
      throw new Error('Greska pri dobavljanja kupcevih porudzbina.');
    }
};


export const OtkazivanjePorudzbine = async (idKupca, token) => {
    try{
        const {data} = await axios.put(`${baseUrl}/orders/otkaziPorudzbinu/${idKupca}`,
                'Otkazano',
            {
                headers: 
                {
                    'Content-Type' : 'application/json',
                    'Authorization' : token
                },
                withCredentials: true
            }
        );
        const otkazivanjePorudzbineModel = new OtkazivanjePorudzbineModel(data);
        otkazivanjePorudzbineModel.porudzbinaDto.addAllArtiklePorudzbine(data.porudzbinaDto.elementiPorudzbine);
        return otkazivanjePorudzbineModel;
    }catch(err){
        console.log(err);
        alert("Neuspjesno otkazivanje porudzbine.")
    }
}


export const GetPorudzbinaById = async (id, token) => {
    try{
        const {data} = await axios.get(`${baseUrl}/orders/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }, 
                withCredentials: true
            }
        );
        
        const porudzbinaPregled = new PregledPorudzbineModel(data);
        porudzbinaPregled.addAllImenaArtikala(data.imenaArtikala)
        return porudzbinaPregled;
    }catch(err){
        console.log(err);
        alert("Nesto se desilo prilikom dobavljanja informacija o porudzbini")
        return null;
    }
}

export const CreatePorudzbina = async(porudzbinaDto, token) =>{
    try{
        const {data} = await axios.post(`${baseUrl}/orders/addPorudzbina`,
            porudzbinaDto, 
            {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
            }
        );
        const novaPorudzbina = new PorudzbinaModel(data);
        novaPorudzbina.addAllArtiklePorudzbine(data.elementiPorudzbine)
        return novaPorudzbina;
    } catch(err){
        console.log(err);
         alert("Problem prilikom kreiranja porudzbine");
         return null;
    }    
}



export const GetProdavceveNovePorudzbine = async (id, token) => {
    try{
        const {data} = await axios.get(
            `${baseUrl}/orders/getProdavceveNovePorudzbine/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }, 
                withCredentials: true
            }
        );
        const novePorudzbine = [];
        for(var i = 0; i < data.length; i++){
            var porudzbina = new PorudzbinaModel(data[i]);
            porudzbina.addAllArtiklePorudzbine(data[i].elementiPorudzbine);
            novePorudzbine.push(porudzbina);
        }
        return novePorudzbine;
    }catch(err){
        console.log(err);
        alert("Nesto se desilo prilikom dobavljanja informacija novim prodavcevim porudzbinama")
        return null;
    }
}

export const GetArtiklePorudzbineProdavca = async (id, prodavacId, token) => {
    try {
      const response = await axios.get(`${baseUrl}/orders/${id}/artikliProdavca/${prodavacId}`,
        {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }, 
        withCredentials: true
        }
    );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Greska prilikom dobavljanja detalja porudzbine');
    }
  };

  export const GetPrethodnePorudzbineProdavac = async (prodavacId, token) => {
    try {
      const {data} = await axios.get(`${baseUrl}/orders/getProdavcevePrethodnePorudzbine/${prodavacId}`,
        {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }, 
        withCredentials: true
        }
    );
        const prethodnePorudzbine = [];
        for(var i = 0; i < data.length; i++){
            var porudzbina = new PorudzbinaModel(data[i]);
            porudzbina.addAllArtiklePorudzbine(data[i].elementiPorudzbine);
            prethodnePorudzbine.push(porudzbina);
        }
        return prethodnePorudzbine;
    } catch (error) {
      console.error(error);
      throw new Error('Greska prilikom dobavljanja prethodnih porudzbina prodavca.');
    }
  };

  
export const GetAllPorudzbine = async (token) => {
    try{
        const {data} = await axios.get(
            `${baseUrl}/orders`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }, 
                withCredentials: true
            }
        );
        const svePorudzbine = [];
        for(var i = 0; i < data.length; i++){
            const porudzbina = new PorudzbinaModel(data[i]);
            porudzbina.addAllArtiklePorudzbine(data[i].elementiPorudzbine);
            svePorudzbine.push(porudzbina);
        }
        return data;
    }catch(err){
        console.log(err);
        alert("Nesto se desilo prilikom dobavljanja informacija o svim porudzbinama")
        return null;
    }
}