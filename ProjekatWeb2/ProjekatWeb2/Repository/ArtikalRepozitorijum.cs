using Microsoft.EntityFrameworkCore;
using ProjekatWeb2.Infrastructure;
using ProjekatWeb2.Models;
using ProjekatWeb2.Repository.Interfaces;

namespace ProjekatWeb2.Repository
{
    public class ArtikalRepozitorijum : IArtikalRepozitorijum
    {
        private readonly OnlineProdavnicaDbContext _dbContext;

        public ArtikalRepozitorijum(OnlineProdavnicaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddArtikal(Artikal artikal)
        {
            if (artikal == null)
            {
                throw new ArgumentNullException(nameof(artikal), "Artikal ne sme biti null.");

            }
            _dbContext.Artikli.Add(artikal);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Artikal>> AllArtikli()
        {
            return await _dbContext.Artikli.ToListAsync();
        }

        public async Task AzurirajArtikal(Artikal artikal)
        {
            _dbContext.Update(artikal);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteArtikal(Artikal artikal)
        {
            if (artikal != null)
            {
                _dbContext.Artikli.Remove(artikal);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<Artikal> GetArtikalById(long id)
        {
            return await _dbContext.Artikli.FindAsync(id);
        }

        public async Task<IEnumerable<Artikal>> GetProdavceviArtikli(long id)
        {
            return await _dbContext.Artikli.Where(a => a.ProdavacId == id).ToListAsync();
        }
    }
}
