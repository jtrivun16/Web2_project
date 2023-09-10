using Microsoft.EntityFrameworkCore;
using ProjekatWeb2.Enumerations;
using ProjekatWeb2.Infrastructure;
using ProjekatWeb2.Models;
using ProjekatWeb2.Repository.Interfaces;

namespace ProjekatWeb2.Repository
{
    public class KorisnikRepozitorijum : IKorisnikRepozitorijum
    {
        private readonly OnlineProdavnicaDbContext _dbContext;

        public KorisnikRepozitorijum(OnlineProdavnicaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddKorisnik(Korisnik korisnik)
        {
            if (korisnik == null)
            {
                throw new ArgumentNullException(nameof(korisnik), "Korisnik ne može biti null.");

            }
            if (korisnik.TipKorisnika == TipKorisnika.Administrator)
            {
                korisnik.VerifikacijaProdavca = VerifikacijaProdavca.Prihvacen;

            }
            else if (korisnik.TipKorisnika == TipKorisnika.Kupac)
            {
                korisnik.VerifikacijaProdavca = VerifikacijaProdavca.Prihvacen;
            }
            else
            {
                korisnik.VerifikacijaProdavca = VerifikacijaProdavca.UProcesu;
            }
            _dbContext.Korisnici.Add(korisnik);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteKorisnikById(long id)
        {
            var korisnik = await _dbContext.Korisnici.FirstOrDefaultAsync(k => k.Id == id);
            if (korisnik != null)
            {
                _dbContext.Korisnici.Remove(korisnik);
                await _dbContext.SaveChangesAsync();

            }
        }

        public async Task<List<Korisnik>> GetAllKorisnici()
        {
            return await _dbContext.Korisnici.ToListAsync();
        }

        public async Task<Korisnik> GetKorisnikByEmail(string email)
        {
            return await _dbContext.Korisnici.FirstOrDefaultAsync(k => k.Email == email);
        }

        public async Task<Korisnik> GetKorisnikById(long id)
        {
            return await _dbContext.Korisnici.Include(x => x.ArtikliProdavac).FirstOrDefaultAsync(k => k.Id == id);
        }

        //svi verifikovani prodavci
        public async Task<List<Korisnik>> SviProdavci()
        {
            var prodavci = await _dbContext.Korisnici
                        .Where(k => k.TipKorisnika == TipKorisnika.Prodavac)
                        .ToListAsync();
            return prodavci;
        }

        public async Task UpdateKorisnik(Korisnik korisnik)
        {
            _dbContext.Update(korisnik);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Korisnik>> VerifikujProdavca(long id, string statusVerifikacije)
        {
            Korisnik prodavac = _dbContext.Korisnici.Find(id);

            if (statusVerifikacije.Equals(VerifikacijaProdavca.Prihvacen.ToString()))
            {
                prodavac.VerifikacijaProdavca = VerifikacijaProdavca.Prihvacen;
            }
            else if (statusVerifikacije.Equals(VerifikacijaProdavca.Odbijen.ToString()))
            {
                prodavac.VerifikacijaProdavca = VerifikacijaProdavca.Odbijen;
            }
            await _dbContext.SaveChangesAsync();

            return await SviProdavci();
        }
    }
}
