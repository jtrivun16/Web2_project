using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using ProjekatWeb2.Models;

namespace ProjekatWeb2.Infrastructure.Configurations
{
    public class ElementPorudzbineConfiguration : IEntityTypeConfiguration<ElementPorudzbine>
    {
        public void Configure(EntityTypeBuilder<ElementPorudzbine> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.HasOne(x => x.Porudzbina)
                   .WithMany(x => x.ElementiPorudzbine)
                   .HasForeignKey(x => x.IdPorudzbina)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
