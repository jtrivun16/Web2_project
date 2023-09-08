using ProjekatWeb2.Dto;

namespace ProjekatWeb2.Interfaces
{
    public interface IPorudzbinaService
    {
        Task<PorudzbinaDto> AddPorudzbina(PorudzbinaDto newPorudzbinaDto);
        Task<List<PorudzbinaDto>> GetAllPorudzbina();
        Task<PregledPorudzbineDto> GetPorudzbinaById(long id);
        Task<PorudzbinaDto> UpdatePorudzbina(long id, PorudzbinaDto updatePorudzbinaDto);
        Task DeletePorudzbina(long id);
        Task<List<PorudzbinaDto>> GetKupcevePorudzbine(long id);
        Task<OtkaziPorudzbinuDto> OtkaziPorudzbinu(long id, string statusVerifikacije);
        Task<List<PorudzbinaDto>> GetProdavceveNovePorudzbine(long id);
        Task<List<PorudzbinaDto>> GetProdavcevePrethodnePorudzbine(long id);

        Task<List<ArtikalDto>> DobaviArtiklePorudzbineZaProdavca(long porudzbinaId, long idProdavac);
    }
}
