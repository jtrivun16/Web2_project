import KorisnikModel from "./KorisnikModel";

export default class IspisModel {
    constructor(data){
        this.token = data.token;
        this.korisnikDto = new KorisnikModel(data.korisnikDto);
        this.result = data.result;
    }
}