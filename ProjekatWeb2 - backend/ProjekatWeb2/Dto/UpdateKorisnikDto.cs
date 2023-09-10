namespace ProjekatWeb2.Dto
{
    public class UpdateKorisnikDto
    {
        public long Id { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string KorisnickoIme { get; set; }
        public string Lozinka { get; set; }
        public string Email { get; set; }
        public string Adresa { get; set; }
        public string Slika { get; set; }
        public DateTime DatumRodjenja { get; set; }
    }
}
