using Microsoft.EntityFrameworkCore;
using ProjekatWeb2.Models;

namespace ProjekatWeb2.Infrastructure
{
    public class OnlineProdavnicaDbContext : DbContext
    {
        //Ovde definisemo DbSetove (tabele)
        public DbSet<Korisnik> Korisnici { get; set; }
        public DbSet<Artikal> Artikli { get; set; }
        public DbSet<Porudzbina> Porudzbine { get; set; }

        public OnlineProdavnicaDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //Kazemo mu da pronadje sve konfiguracije u Assembliju i da ih primeni nad bazom
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(OnlineProdavnicaDbContext).Assembly);
        }

        public DbSet<ProjekatWeb2.Models.ElementPorudzbine>? ElementPorudzbine { get; set; }
    }
}
