using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using ProjekatWeb2.Models;

namespace ProjekatWeb2.Infrastructure.Configurations
{
    public class PorudzbinaConfiguration : IEntityTypeConfiguration<Porudzbina>
    {
        public void Configure(EntityTypeBuilder<Porudzbina> builder)
        {
            builder.HasKey(x => x.Id); //Podesavam primarni kljuc tabele

            builder.Property(x => x.Id).ValueGeneratedOnAdd(); //Kazem da ce se primarni kljuc
                                                               //automatski generisati prilikom dodavanja,
                                                               //redom 1 2 3...
            builder.HasOne(x => x.Korisnik)
                   .WithMany(x => x.Porudzbine)
                   .HasForeignKey(x => x.KorisnikId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
