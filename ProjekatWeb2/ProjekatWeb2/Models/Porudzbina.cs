using ProjekatWeb2.Enumerations;

namespace ProjekatWeb2.Models
{
    public class Porudzbina
    {
        public Porudzbina() { }
        public long Id { get; set; }
        public string Komentar { get; set; }
        public string AdresaDostave { get; set; }
        public double Cena { get; set; }
        public DateTime VremeDostave { get; set; }
        public DateTime VremePorucivanja { get; set; }
        public StatusPorudzbine StatusPorudzbine { get; set; }
        public long KorisnikId { get; set; }
        public Korisnik Korisnik { get; set; }
        public List<ElementPorudzbine> ElementiPorudzbine { get; set; }
    }
}
