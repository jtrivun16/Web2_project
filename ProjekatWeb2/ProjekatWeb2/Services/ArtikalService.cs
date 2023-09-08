using AutoMapper;
using ProjekatWeb2.Dto;
using ProjekatWeb2.Interfaces;
using ProjekatWeb2.Models;
using ProjekatWeb2.Repository.Interfaces;

namespace ProjekatWeb2.Services
{
    public class ArtikalService : IArtikalService
    {
        private readonly IMapper _mapper;
        private readonly IArtikalRepozitorijum _artikalRepozitorijum;
        private readonly IKorisnikRepozitorijum _korisnikRepozitorijum;
        private readonly IElementPorudzbineRepozitorijum _elementPorudzbineRepozitorijum;

        public ArtikalService(IMapper mapper, IElementPorudzbineRepozitorijum elementPorudzbineRepozitorijum, IArtikalRepozitorijum artikalRepozitorijum, IKorisnikRepozitorijum korisnikRepozitorijum)
        {
            _mapper = mapper;
            _artikalRepozitorijum = artikalRepozitorijum;
            _korisnikRepozitorijum = korisnikRepozitorijum;
            _elementPorudzbineRepozitorijum = elementPorudzbineRepozitorijum;
        }

        public async Task<ArtikalDto> AddArtikal(ArtikalDto newArtikalDto)
        {
            if (!IsArtikalFieldsValid(newArtikalDto))
                return null;
            var prodavac = await _korisnikRepozitorijum.GetKorisnikById(newArtikalDto.ProdavacId);
            if (prodavac == null)
                return null;

            var newArtikal = _mapper.Map<Artikal>(newArtikalDto);
            newArtikal.Prodavac = prodavac;
            newArtikal.CenaDostave = prodavac.CenaDostave;
            await _artikalRepozitorijum.AddArtikal(newArtikal);

            return _mapper.Map<ArtikalDto>(newArtikal);
        }

        public static bool IsArtikalFieldsValid(ArtikalDto artikalDto)
        {
            if (string.IsNullOrEmpty(artikalDto.Naziv))
                return false;
            if (string.IsNullOrEmpty(artikalDto.Opis))
                return false;
            if (artikalDto.Cena == 0)
                return false;
            if (artikalDto.Kolicina == 0)
                return false;
            if (artikalDto.ProdavacId == 0)
                return false;
            if (string.IsNullOrEmpty(artikalDto.Fotografija))
                return false;


            return true;
        }

        public async Task<bool> DeleteArtikal(long id)
        {
            var deleteArtikal = await _artikalRepozitorijum.GetArtikalById(id);
            if (deleteArtikal == null)
            {
                return false;
            }
            await _artikalRepozitorijum.DeleteArtikal(deleteArtikal);


            await _elementPorudzbineRepozitorijum.DeleteElementiPorudzbine(deleteArtikal.Id);

            return true;
        }

        public async Task<List<ArtikalDto>> GetAllArtikals()
        {
            List<ArtikalDto> artikalList = _mapper.Map<List<ArtikalDto>>(await _artikalRepozitorijum.AllArtikli());
            return artikalList;
        }

        public async Task<ArtikalDto> GetArtikalById(long id)
        {
            var artikal = await _artikalRepozitorijum.GetArtikalById(id);
            if (artikal == null)
            {
                return null;
            }
            return _mapper.Map<ArtikalDto>(artikal);
        }

        public async Task<List<ArtikalDto>> GetProdavceveArtikle(long id)
        {
            var artikli = await _artikalRepozitorijum.GetProdavceviArtikli(id);

            return _mapper.Map<List<ArtikalDto>>(artikli);
        }

        public async Task<ArtikalDto> UpdateArtikal(long id, ArtikalDto artikalDto)
        {
            var updateArtikal = await _artikalRepozitorijum.GetArtikalById(id);
            if (updateArtikal == null)
            {
                return null;
            }

            //if (!IsArtikalFieldsValid(artikalDto))
            //  throw new Exception("Sva polja moraju biti validna.");


            updateArtikal.Naziv = artikalDto.Naziv;
            updateArtikal.Cena = artikalDto.Cena;
            updateArtikal.Kolicina = artikalDto.Kolicina;
            updateArtikal.Opis = artikalDto.Opis;
            updateArtikal.Fotografija = artikalDto.Fotografija;

            await _artikalRepozitorijum.AzurirajArtikal(updateArtikal);

            return _mapper.Map<ArtikalDto>(updateArtikal);
        }
    }
}
