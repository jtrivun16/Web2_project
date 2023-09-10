export default class PregledPorudzbineModel {
    constructor(data){
        this.id = data.id;
        this.adresaDostave = data.adresaDostave;
        this.komentar = data.komentar;
        this.vrijemePorucivanja = data.vrijemePorucivanja;
        this.vrijemeDostave = data.vrijemeDostave;
        this.cijena = data.cijena;
        this.imenaArtikala = [];
        this.statusPorudzbine = this.statusPorudzbine;
    }

    addAllImenaArtikala(imenaArtikala){
        for(var i = 0; i < imenaArtikala.length; i++){
            this.imenaArtikala.push(imenaArtikala[i]);
        }
    }
}