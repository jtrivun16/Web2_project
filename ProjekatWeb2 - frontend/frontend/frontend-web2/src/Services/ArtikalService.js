import axios from 'axios';
import ArtikalModel from "../Models/ArtikalModel";

const baseUrl = process.env.REACT_APP_API_BACKEND;

export const GetAllArticles = async(token) => {
    try{
        const { data } = await axios.get(`${baseUrl}/articles`,
                {
                    headers: {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${token}`
                    },
                }
            );
        const artikli = data.map(artikal => {
            return new ArtikalModel(artikal);
        })   
        return artikli;
    }catch(err){
        alert("Nesto se desilo prilikom dobavljanja artikala");
        return null;
    }
}


export const AddArtikal = async(artikalDto, token) => {
    try{
        const {data} = await axios.post(`${baseUrl}/articles/addArtikal`,
            artikalDto,
            {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
                withCredentials: true
            }
        );
        const newArtikal = new ArtikalModel(data);
        return newArtikal;
    }catch(err){
        alert("Nesto se desilo prilikom dodavanja artikla")
        return null;
    }
}


export const GetProdavceveArtikle = async(prodavacId, token) => {
    try{
        const {data} = await axios.get(
            `${baseUrl}/articles/getProdavceveArtikle/${prodavacId}`,
            {
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                withCredential: true
            }
        );
        const prodavceviArtikli = data.map(artikal => {
            return new ArtikalModel(artikal);
        })
        return prodavceviArtikli;
    }catch(err){
        console.log(err);
        alert('Nesto se desilo prilikom dobavljanja artikala');
        return null;
    }
}


export const DeleteArtikal = async(id, token) => {
    try{
        const {data} = axios.delete(
            `${baseUrl}/articles/${id}`,
            {
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                withCredential: true
            }
        );
        return data;
    }catch(err){
        console.log(err);
        alert("Nesto se desilo prilikom brisanja artikla");
        return null;
    }
}

export const GetArtikalById = async(artikalId, token) => {
    try{
        const {data} = await axios.get(
            `${baseUrl}/articles/${artikalId}`,
            {
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                withCredential: true
            }
        );
        const artikal = new ArtikalModel(data);
        return artikal;
    }catch(err){
        console.log(err);
        alert('Nesto se desilo prilikom dobavljanja informacija o artiklu');
        return null;
    }
}


export const UpdateArtikal = async(id, artikalDto, token) => {
    try{
        const {data} = await axios.put(
            `${baseUrl}/articles/${id}`, 
            artikalDto,
            {
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                withCredential: true
            }
        );
        const updateArtikal = new ArtikalModel(data);
        return updateArtikal;
    }catch(err){
        console.log(err);
        alert('Nesto se desilo prilikom azuriranja informacija o artiklu');
        return null;
    }
}