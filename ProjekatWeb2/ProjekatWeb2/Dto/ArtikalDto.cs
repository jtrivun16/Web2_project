using ProjekatWeb2.Models;

namespace ProjekatWeb2.Dto
{
    public class ArtikalDto
    {
        public long Id { get; set; }
        public string Naziv { get; set; }
        public double Cena { get; set; }
        public int Kolicina { get; set; }
        public string Opis { get; set; }
        public string Fotografija { get; set; }
        public double CenaDostave { get; set; }
        public long ProdavacId { get; set; }
    }
}
