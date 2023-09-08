using ProjekatWeb2.Enumerations;

namespace ProjekatWeb2.Dto
{
    public class PregledPorudzbineDto
    {
        public long Id { get; set; }
        public string AdresaDostave { get; set; }
        public string Komentar { get; set; }
        public DateTime VremePorucivanja { get; set; }
        public DateTime VremeDostave { get; set; }
        public double Cena { get; set; }
        public List<string> ImenaArtikala { get; set; }
        public StatusPorudzbine StatusPorudzbine { get; set; }
    }
}
