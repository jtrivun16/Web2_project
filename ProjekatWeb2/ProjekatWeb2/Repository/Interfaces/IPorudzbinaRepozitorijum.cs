using ProjekatWeb2.Models;

namespace ProjekatWeb2.Repository.Interfaces
{
    public interface IPorudzbinaRepozitorijum
    {
        Task AddPorudzbina(Porudzbina porudzbina);
        Task DeletePorudzbina(Porudzbina porudzbina);
        Task<Porudzbina> GetPorudzbinaById(long id);
        Task<IEnumerable<Porudzbina>> AllPorudzbine();
        Task<IEnumerable<Porudzbina>> AllKupacPorudzbine(long idPorudzbina);
        Task SacuvajIzmjene();
        //Task<List<Artikal>> DobaviArtiklePorudzbineZaProdavca(int porudzbinaId, int prodavacId);
    }
}
