export default class KorisnikModel{
    constructor(data){
        this.id = data.id;
        this.ime = data.ime;
        this.prezime = data.prezime;
        this.korisnickoIme = data.korisnickoIme;
        this.lozinka = data.lozinka;
        this.email = data.email;
        this.adresa = data.adresa;
        this.datumRodjenja = data.datumRodjenja;
        this.slika = data.slika;
        this.tipKorisnika = data.tipKorisnika;
        this.cijenaDostave = data.cijenaDostave;
        this.verifikacijaProdavca = data.verifikacijaProdavca;
    }
}