using Microsoft.EntityFrameworkCore;
using ProjekatWeb2.Infrastructure;
using ProjekatWeb2.Models;
using ProjekatWeb2.Repository.Interfaces;

namespace ProjekatWeb2.Repository
{
    public class PorudzbinaRepozitorijum : IPorudzbinaRepozitorijum
    {
        private readonly OnlineProdavnicaDbContext _dbContext;

        public PorudzbinaRepozitorijum(OnlineProdavnicaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddPorudzbina(Porudzbina porudzbina)
        {
            if (porudzbina == null)
            {
                throw new ArgumentNullException(nameof(porudzbina), "Porudzbina ne sme biti null.");
            }
            _dbContext.Porudzbine.Add(porudzbina);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Porudzbina>> AllKupacPorudzbine(long id)
        {
            var korisnik = await _dbContext.Korisnici.Include(x => x.ArtikliProdavac).FirstOrDefaultAsync(k => k.Id == id);
            var porudzbine = await _dbContext.Porudzbine.Where(p => p.KorisnikId == id).Include(x => x.ElementiPorudzbine).ToListAsync();
            foreach (var porudzbina in porudzbine)
            {
                if (porudzbina.ElementiPorudzbine == null || porudzbina.ElementiPorudzbine.Count == 0)
                {
                    DeletePorudzbina(porudzbina);
                }
            }

            return await _dbContext.Porudzbine
            .Where(p => p.KorisnikId == id).Include(x => x.ElementiPorudzbine)
            .ToListAsync();
        }

        public async Task<IEnumerable<Porudzbina>> AllPorudzbine()
        {
            return await _dbContext.Porudzbine.Include(x => x.ElementiPorudzbine).ToListAsync();
        }

        public async Task DeletePorudzbina(Porudzbina porudzbina)
        {
            _dbContext.Porudzbine.Remove(porudzbina);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Porudzbina> GetPorudzbinaById(long id)
        {
            return await _dbContext.Porudzbine.Include(x => x.ElementiPorudzbine).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task SacuvajIzmjene()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
