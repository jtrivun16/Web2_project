using ProjekatWeb2.Models;

namespace ProjekatWeb2.Repository.Interfaces
{
    public interface IArtikalRepozitorijum
    {
        Task<IEnumerable<Artikal>> AllArtikli();
        Task<Artikal> GetArtikalById(long id);
        Task AddArtikal(Artikal artikal);
        Task DeleteArtikal(Artikal artikal);
        Task<IEnumerable<Artikal>> GetProdavceviArtikli(long id);
        Task AzurirajArtikal(Artikal artikal);
    }
}
