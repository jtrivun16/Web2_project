using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjekatWeb2.Models;

namespace ProjekatWeb2.Infrastructure.Configurations
{
    public class ArtikalConfiguration : IEntityTypeConfiguration<Artikal>
    {
        public void Configure(EntityTypeBuilder<Artikal> builder)
        {
            builder.HasKey(x => x.Id); //kljuc id generise sam
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.HasOne(x => x.Prodavac) //atikal ima jednog prodavca
                   .WithMany(x => x.ArtikliProdavac) //a prodavac ima vise artikala
                   .HasForeignKey(x => x.ProdavacId) //strani kljuc
                   .OnDelete(DeleteBehavior.Cascade); //ako se obrise prodavac brise i njegov artikal        
        }
    }
}
