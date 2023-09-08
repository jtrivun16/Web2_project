using ProjekatWeb2.Models;

namespace ProjekatWeb2.Repository.Interfaces
{
    public interface IElementPorudzbineRepozitorijum
    {
        Task AddElementPorudzbine(ElementPorudzbine elementPorudzbine);
        Task<IEnumerable<ElementPorudzbine>> AllElementiPorudzbina();
        Task DeleteElementiPorudzbine(long id);
    }
}
