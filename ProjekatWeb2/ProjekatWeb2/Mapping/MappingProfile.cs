using AutoMapper;
using ProjekatWeb2.Dto;
using ProjekatWeb2.Models;

namespace ProjekatWeb2.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Artikal, ArtikalDto>().ReverseMap();
            CreateMap<ElementPorudzbine, ElementPorudzbineDto>().ReverseMap();
            CreateMap<Korisnik, KorisnikDto>().ReverseMap();
            CreateMap<Porudzbina, PorudzbinaDto>().ReverseMap();
            CreateMap<Korisnik, UpdateKorisnikDto>().ReverseMap();
            CreateMap<Porudzbina, PregledPorudzbineDto>().ReverseMap();
            CreateMap<Korisnik, GoogleLoginDto>().ReverseMap();

            //dodaj
        }
    }
}
