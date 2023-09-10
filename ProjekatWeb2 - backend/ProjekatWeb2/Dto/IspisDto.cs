namespace ProjekatWeb2.Dto
{
    public class IspisDto
    {
        public string Token { get; set; }
        public KorisnikDto KorisnikDto { get; set; }
        public string Result { get; set; }


        public IspisDto(string result)
        {
            Token = "";
            KorisnikDto = null;
            Result = result;
        }

        public IspisDto(string token, KorisnikDto korisnikDto, string result)
        {
            Token = token;
            KorisnikDto = korisnikDto;
            Result = result;
        }
    }
}
