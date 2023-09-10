import PorudzbinaModel from "./PorudzbinaModel";

export default class OtkazivanjePorudzbineModel{
    constructor(data){
        this.message = data.message;
        this.porudzbinaDto = new PorudzbinaModel(data.porudzbinaDto);
    }
}