using ProjekatWeb2.Dto;

namespace ProjekatWeb2.Interfaces
{
    public interface IArtikalService
    {
        Task<ArtikalDto> AddArtikal(ArtikalDto newArtikalDto);
        Task<List<ArtikalDto>> GetAllArtikals();
        Task<ArtikalDto> GetArtikalById(long id);
        Task<ArtikalDto> UpdateArtikal(long id, ArtikalDto updateArtikalDto);
        Task<bool> DeleteArtikal(long id);
        Task<List<ArtikalDto>> GetProdavceveArtikle(long id);
    }
}
