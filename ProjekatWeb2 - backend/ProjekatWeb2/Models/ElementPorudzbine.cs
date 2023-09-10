namespace ProjekatWeb2.Models
{
    public class ElementPorudzbine
    {
        public long Id { get; set; }
        public long IdArtikal { get; set; }
        public int Kolicina { get; set; }
        public long IdPorudzbina { get; set; }
        public Porudzbina Porudzbina { get; set; }
    }
}
