export default class ArtikalModel {
    constructor(data){
        this.id = data.id;
        this.naziv = data.naziv;
        this.cijena = data.cijena;
        this.kolicina = data.kolicina;
        this.opis = data.opis;
        this.fotografija = data.fotografija;
        this.cijenaDostave = data.cijenaDostave;
        this.prodavacId = data.prodavacId;
    }
}