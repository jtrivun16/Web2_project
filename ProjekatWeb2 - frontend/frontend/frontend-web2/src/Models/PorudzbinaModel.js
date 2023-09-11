
export default class PorudzbinaModel {
    constructor(data){
        this.id = data.id;
        this.komentar = data.komentar;
        this.adresaDostave = data.adresaDostave;
        this.cena = data.cena;
        this.vremeDostave = data.vremeDostave;
        this.vremePorucivanja = data.vremePorucivanja;
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