using ProjekatWeb2.Models;

namespace ProjekatWeb2.Repository.Interfaces
{
    public interface IKorisnikRepozitorijum
    {
        Task AddKorisnik(Korisnik korisnik);
        Task<Korisnik> GetKorisnikById(long id);
        Task<Korisnik> GetKorisnikByEmail(string email);
        Task<List<Korisnik>> GetAllKorisnici();
        Task UpdateKorisnik(Korisnik korisnik);
        Task DeleteKorisnikById(long id);
        Task<List<Korisnik>> SviProdavci();
        Task<List<Korisnik>> VerifikujProdavca(long id, string statusVerifikacije);
    }
}
