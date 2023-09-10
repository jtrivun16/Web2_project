using ProjekatWeb2.Dto;

namespace ProjekatWeb2.Interfaces
{
    public interface IKorisnikService
    {
        Task<KorisnikDto> AddKorisnik(KorisnikDto korisnikDto);
        Task<IspisDto> Login(LoginDto loginKorisnikDto);
        Task<IspisDto> Registration(KorisnikDto registerKorisnik);
        Task<KorisnikDto> GetKorisnik(long id);
        Task<List<KorisnikDto>> GetAllKorisnici();
        Task<KorisnikDto> UpdateKorisnik(long id, KorisnikDto korisnikDto);
        Task DeleteKorisnik(long id);
        Task<List<KorisnikDto>> GetProdavci();
        Task<List<KorisnikDto>> VerifyProdavac(long id, string statusVerifikacije);

        Task<IspisDto> LoginGoogle(ExternalRegister googleToken);
    }
}
