export default class ArtikalModel {
    constructor(data){
        this.id = data.id;
        this.naziv = data.naziv;
        this.cena = data.cena;
        this.kolicina = data.kolicina;
        this.opis = data.opis;
        this.fotografija = data.fotografija;
        this.cenaDostave = data.cenaDostave;
        this.prodavacId = data.prodavacId;
    }
}