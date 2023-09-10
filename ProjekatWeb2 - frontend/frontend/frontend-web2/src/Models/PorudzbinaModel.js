
export default class PorudzbinaModel {
    constructor(data){
        this.id = data.id;
        this.komentar = data.komentar;
        this.adresaDostave = data.adresaDostave;
        this.cijena = data.cijena;
        this.vrijemeDostave = data.vrijemeDostave;
        this.vrijemePorucivanja = data.vrijemePorucivanja;
        this.statusPorudzbine = data.statusPorudzbine;
        this.korisnikId = data.korisnikId;
        this.elementiPorudzbine = [];
    }

    addAllArtiklePorudzbine(elementiPorudzbine){
        for(var i = 0; i < elementiPorudzbine.length; i++){
            this.elementiPorudzbine.push(elementiPorudzbine[i]);
        }
    }
}