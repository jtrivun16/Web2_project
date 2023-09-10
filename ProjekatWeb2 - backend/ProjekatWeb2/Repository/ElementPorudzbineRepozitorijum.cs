using Microsoft.EntityFrameworkCore;
using ProjekatWeb2.Infrastructure;
using ProjekatWeb2.Models;
using ProjekatWeb2.Repository.Interfaces;

namespace ProjekatWeb2.Repository
{
    public class ElementPorudzbineRepozitorijum : IElementPorudzbineRepozitorijum
    {
        private readonly OnlineProdavnicaDbContext _dbContext;

        public ElementPorudzbineRepozitorijum(OnlineProdavnicaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddElementPorudzbine(ElementPorudzbine elementPorudzbine)
        {
            if (elementPorudzbine == null)
            {
                throw new ArgumentNullException(nameof(elementPorudzbine), "Element porudzbine ne sme biti null.");
            }
            _dbContext.ElementPorudzbine.Add(elementPorudzbine);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<ElementPorudzbine>> AllElementiPorudzbina()
        {
            return await _dbContext.ElementPorudzbine.Include(x => x.Porudzbina).ToListAsync();
        }

        public async Task DeleteElementiPorudzbine(long id)
        {
            _dbContext.ElementPorudzbine.RemoveRange(_dbContext.ElementPorudzbine.Where(x => x.IdArtikal == id));
            await _dbContext.SaveChangesAsync();
        }
    }
}
