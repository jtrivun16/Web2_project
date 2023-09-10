using ProjekatWeb2.Enumerations;

namespace ProjekatWeb2.Models
{
    public class Korisnik
    {
        public Korisnik() { }

        public long Id { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string KorisnickoIme { get; set; }
        public string Lozinka { get; set; }
        public string Email { get; set; }
        public string Adresa { get; set; }
        public DateTime DatumRodjenja { get; set; }
        public string Slika { get; set; }
        public TipKorisnika TipKorisnika { get; set; }
        public double CenaDostave { get; set; }
        public VerifikacijaProdavca VerifikacijaProdavca { get; set; }
        public List<Porudzbina> Porudzbine { get; set; }
        public List<Artikal> ArtikliProdavac { get; set; }
    }
}
