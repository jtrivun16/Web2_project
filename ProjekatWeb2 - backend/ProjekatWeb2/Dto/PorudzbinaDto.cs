using ProjekatWeb2.Enumerations;

namespace ProjekatWeb2.Dto
{
    public class PorudzbinaDto
    {
        public long Id { get; set; }
        public string Komentar { get; set; }
        public string AdresaDostave { get; set; }
        public double Cena { get; set; }
        public DateTime VremeDostave { get; set; }
        public DateTime VremePorucivanja { get; set; }
        public StatusPorudzbine StatusPorudzbine { get; set; }
        public long KorisnikId { get; set; }
        public List<ElementPorudzbineDto> ElementiPorudzbine { get; set; }
    }
}
