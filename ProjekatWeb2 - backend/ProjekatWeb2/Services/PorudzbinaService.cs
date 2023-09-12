using AutoMapper;
using ProjekatWeb2.Dto;
using ProjekatWeb2.Enumerations;
using ProjekatWeb2.Interfaces;
using ProjekatWeb2.Models;
using ProjekatWeb2.Repository.Interfaces;

namespace ProjekatWeb2.Services
{
    public class PorudzbinaService : IPorudzbinaService
    {

        private readonly IMapper _mapper;
        private readonly IArtikalRepozitorijum _artikalRepozitorijum;
        private readonly IKorisnikRepozitorijum _korisnikRepozitorijum;
        private readonly IPorudzbinaRepozitorijum _porudzbinaRepozitorijum;
        private readonly IElementPorudzbineRepozitorijum _elementPorudzbineRepozitorijum;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PorudzbinaService(IMapper mapper, IArtikalRepozitorijum artikalRepozitorijum, IKorisnikRepozitorijum korisnikRepozitorijum, IPorudzbinaRepozitorijum porudzbinaRepozitorijum, IElementPorudzbineRepozitorijum elementPorudzbineRepozitorijum, IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _artikalRepozitorijum = artikalRepozitorijum;
            _korisnikRepozitorijum = korisnikRepozitorijum;
            _porudzbinaRepozitorijum = porudzbinaRepozitorijum;
            _elementPorudzbineRepozitorijum = elementPorudzbineRepozitorijum;
            _httpContextAccessor = httpContextAccessor;

        }

        public async Task<PorudzbinaDto> AddPorudzbina(PorudzbinaDto newPorudzbinaDto)
        {
            //ako je lista artikala prazna, onda ne moze da se napravi porudzbina
            if (newPorudzbinaDto.ElementiPorudzbine == null)
            {
                return null;
            }
            var korisnik = await _korisnikRepozitorijum.GetKorisnikById(newPorudzbinaDto.KorisnikId);
            if (korisnik == null)
                return null;

            if (string.IsNullOrEmpty(newPorudzbinaDto.AdresaDostave))
            {
                return null;
            }

            var newPorudzbina = _mapper.Map<Porudzbina>(newPorudzbinaDto);
            newPorudzbina.Korisnik = korisnik;

            //ostalo mi vreme dostave 
            //generisem neki broj izmedju 2 i 12, jer vreme dostave mora biti vece od 1h
            Random hoursGenerator = new Random();
            int additionalHours = hoursGenerator.Next(2, 12);
            newPorudzbina.VremeDostave = DateTime.Now.AddHours(additionalHours);
            newPorudzbina.ElementiPorudzbine = null;
            newPorudzbina.Cena = newPorudzbinaDto.Cena;
            newPorudzbina.StatusPorudzbine = Enumerations.StatusPorudzbine.Prihvaceno;
            newPorudzbina.VremePorucivanja = DateTime.Now;
            await _porudzbinaRepozitorijum.AddPorudzbina(newPorudzbina);

            //sve ovo mora da stavim u try, jer u slucaju da pukne, porudzbina mora da se obrise iz baze
            //mora da napravim transkacionu operaciju

            try
            {
                //ostali mi artikili u porudzbini
                foreach (ElementPorudzbineDto elementPorudzbineDto in newPorudzbinaDto.ElementiPorudzbine)
                {
                    //pronaci artikal koji odgovara artiklu porudzbine
                    Artikal artikal = await _artikalRepozitorijum.GetArtikalById(elementPorudzbineDto.IdArtikal);

                    //ako artikal ne postoji vrati null
                    if (artikal == null)
                    {
                        //stavim da se porudzbina izbaci ako nije uspelo pronalazenje artikla
                        await _porudzbinaRepozitorijum.DeletePorudzbina(newPorudzbina);
                        return null;
                    }

                    if (artikal.Kolicina < elementPorudzbineDto.Kolicina)
                    {
                        //stavim da se porudzbina izvbaci ako se trazi vise nego sto ima
                        await _porudzbinaRepozitorijum.DeletePorudzbina(newPorudzbina);
                        return null;
                    }

                    //newPorudzbina.Cijena += elementPorudzbineDto.Kolicina * artikal.Cijena + artikal.CijenaDostave;

                    //skinuti kolicinu artikala kolko je poruceno
                    artikal.Kolicina -= elementPorudzbineDto.Kolicina;

                    //kreiranje elementa porudzbine
                    ElementPorudzbine element = new ElementPorudzbine
                    {
                        IdArtikal = artikal.Id,
                        Kolicina = elementPorudzbineDto.Kolicina,
                        IdPorudzbina = newPorudzbina.Id,
                        Porudzbina = newPorudzbina,
                    };

                    //dodati svaki porudzbinaArtikal u db set
                    //newPorudzbina.ElementiPorudzbine.Add(element);
                    await _elementPorudzbineRepozitorijum.AddElementPorudzbine(element);
                }

                //kad je napravljena porudzbina, onda nju treba dodati u kupcu i na kraju konacno sacuvati svae changes
                //mozda ne treba da se ovo uradi jer je uradjen svae changes, on je vec sacuvao korisniku na osnovu ID porudbinu
                //_dbContext.Korisnici.Find(newPorudzbinaDto.KorisnikId).Porudzbine.Add(newPorudzbina);

                //await _dbContext.SaveChangesAsync();

                PorudzbinaDto returnPorudzbinaDto = _mapper.Map<PorudzbinaDto>(newPorudzbina);
                return returnPorudzbinaDto;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                //obrisati porudzbinu
                ReturnKolicinaArtikalaPorudzbine(newPorudzbinaDto.ElementiPorudzbine);

                await _porudzbinaRepozitorijum.DeletePorudzbina(newPorudzbina);
                return null;
            }
        }

        public async void ReturnKolicinaArtikalaPorudzbine(List<ElementPorudzbineDto> elementiPorudzbineDto)
        {
            foreach (ElementPorudzbineDto elementPorudzbineDto in elementiPorudzbineDto)
            {
                var artikalPorudzbine = await _artikalRepozitorijum.GetArtikalById(elementPorudzbineDto.IdArtikal);
                if (artikalPorudzbine != null)
                {
                    artikalPorudzbine.Kolicina += elementPorudzbineDto.Kolicina;
                }
            }
        }

        public async Task DeletePorudzbina(long id)
        {
            var deletePorudzbina = await _porudzbinaRepozitorijum.GetPorudzbinaById(id);
            await _porudzbinaRepozitorijum.DeletePorudzbina(deletePorudzbina);

        }

        public async Task<List<PorudzbinaDto>> GetAllPorudzbina()
        {
            List<PorudzbinaDto> porudzbineList = _mapper.Map<List<PorudzbinaDto>>(await _porudzbinaRepozitorijum.AllPorudzbine());
            var trenutnoVreme = DateTime.Now;

            foreach (var porudzbina in porudzbineList)
            {
                if (porudzbina.StatusPorudzbine != StatusPorudzbine.Otkazano && porudzbina.VremeDostave < trenutnoVreme)
                {
                    porudzbina.StatusPorudzbine = StatusPorudzbine.Isporuceno;
                }
            }

            return porudzbineList;
        }

        public async Task<List<PorudzbinaDto>> GetKupcevePorudzbine(long id)
        {/*
            var porudzbine = await _porudzbinaRepozitorijum.AllKupacPorudzbine(id);
            
            var korisnik = await _korisnikRepozitorijum.GetKorisnikById(id);
            foreach (var porudzbina in porudzbine)
            {
                if (porudzbina.ElementiPorudzbine == null || porudzbina.ElementiPorudzbine.Count == 0)
                {
                    await _porudzbinaRepozitorijum.DeletePorudzbina(porudzbina);
                }
            }
            */
            var svePorudzbineKupca = await _porudzbinaRepozitorijum.AllKupacPorudzbine(id);


            var trenutnoVreme = DateTime.Now;


            foreach (var porudzbina in svePorudzbineKupca)
            {
                if (porudzbina.StatusPorudzbine != StatusPorudzbine.Otkazano && porudzbina.VremeDostave < trenutnoVreme)
                {
                    porudzbina.StatusPorudzbine = StatusPorudzbine.Isporuceno;
                }
            }
            return _mapper.Map<List<PorudzbinaDto>>(svePorudzbineKupca);
        }

        public async Task<PregledPorudzbineDto> GetPorudzbinaById(long id)
        {
            Porudzbina porudzbinaPrikaz = await _porudzbinaRepozitorijum.GetPorudzbinaById(id);
            if (porudzbinaPrikaz == null)
            {
                return null;
            }

            PregledPorudzbineDto porudzbinaPrikazDto = _mapper.Map<PregledPorudzbineDto>(porudzbinaPrikaz);
            porudzbinaPrikazDto.ImenaArtikala = new List<string>();

            foreach (ElementPorudzbine artikalPorudzbine in porudzbinaPrikaz.ElementiPorudzbine)
            {
                Artikal praviArtikal = await _artikalRepozitorijum.GetArtikalById(artikalPorudzbine.IdArtikal);
                if (praviArtikal == null)
                {
                    return null;
                }
                porudzbinaPrikazDto.ImenaArtikala.Add(praviArtikal.Naziv);
            }

            return porudzbinaPrikazDto;
        }

        public async Task<List<PorudzbinaDto>> GetProdavceveNovePorudzbine(long id)
        {
            try
            {
                //
                //Korisnik prodavac = await _dbContext.Korisnici.Include(x => x.ProdavceviArtikli).FirstAsync(x => x.Id == id);
                Korisnik prodavac = await _korisnikRepozitorijum.GetKorisnikById(id);

                List<Porudzbina> prodavcevePorudzbine = new List<Porudzbina>();
                var elementiPorudzbine = await _elementPorudzbineRepozitorijum.AllElementiPorudzbina();

                foreach (Artikal prodavcevArtikal in prodavac.ArtikliProdavac)
                {
                    foreach (ElementPorudzbine prodavcevArtikalPorudzbine in elementiPorudzbine)
                    {
                        //ako je datum isporuke porudzbine veci od trenutnog, i ako je stanje porudzbine nije otkazana i ako porudzbina vec nije ubacena tu
                        if (prodavcevArtikalPorudzbine.IdArtikal == prodavcevArtikal.Id
                            && prodavcevArtikalPorudzbine.Porudzbina.VremeDostave > DateTime.Now
                            && prodavcevArtikalPorudzbine.Porudzbina.StatusPorudzbine != StatusPorudzbine.Otkazano
                            && !prodavcevePorudzbine.Contains(prodavcevArtikalPorudzbine.Porudzbina))
                        {
                            prodavcevePorudzbine.Add(prodavcevArtikalPorudzbine.Porudzbina);
                        }
                    }
                }
                return _mapper.Map<List<PorudzbinaDto>>(prodavcevePorudzbine);

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }

        public async Task<List<PorudzbinaDto>> GetProdavcevePrethodnePorudzbine(long id)
        {
            try
            {
                //
                //Korisnik prodavac = await _dbContext.Korisnici.Include(x => x.ProdavceviArtikli).FirstAsync(x => x.Id == id);
                Korisnik prodavac = await _korisnikRepozitorijum.GetKorisnikById(id);

                List<Porudzbina> prodavcevePorudzbine = new List<Porudzbina>();
                var elementiPorudzbine = await _elementPorudzbineRepozitorijum.AllElementiPorudzbina();
                foreach (Artikal prodavcevArtikal in prodavac.ArtikliProdavac)
                {
                    foreach (ElementPorudzbine prodavcevArtikalPorudzbine in elementiPorudzbine)
                    {
                        //ako je datum isporuke porudzbine veci od trenutnog, i ako je stanje porudzbine nije otkazana i ako porudzbina vec nije ubacena tu
                        if (prodavcevArtikalPorudzbine.IdArtikal == prodavcevArtikal.Id
                            && prodavcevArtikalPorudzbine.Porudzbina.VremeDostave < DateTime.Now
                            && prodavcevArtikalPorudzbine.Porudzbina.StatusPorudzbine != StatusPorudzbine.Otkazano
                            && !prodavcevePorudzbine.Contains(prodavcevArtikalPorudzbine.Porudzbina))
                        {
                            prodavcevePorudzbine.Add(prodavcevArtikalPorudzbine.Porudzbina);
                        }
                    }
                }
                return _mapper.Map<List<PorudzbinaDto>>(prodavcevePorudzbine);

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }

        public async Task<OtkaziPorudzbinuDto> OtkaziPorudzbinu(long id, string statusPorudzbine)
        {
            try
            {
                Porudzbina otkazivanjePorudzbina = await _porudzbinaRepozitorijum.GetPorudzbinaById(id);
                if ((DateTime.UtcNow - otkazivanjePorudzbina.VremePorucivanja).TotalMinutes < 60 && statusPorudzbine == "Otkazano")
                {
                    otkazivanjePorudzbina.StatusPorudzbine = StatusPorudzbine.Otkazano;

                    foreach (ElementPorudzbine elementPorudzbine in otkazivanjePorudzbina.ElementiPorudzbine)
                    {
                        Artikal praviArtikal = await _artikalRepozitorijum.GetArtikalById(elementPorudzbine.IdArtikal);
                        if (praviArtikal != null)
                        {
                            praviArtikal.Kolicina += elementPorudzbine.Kolicina;
                        }
                    }

                    OtkaziPorudzbinuDto otkazanaPorudzbinaDto = new OtkaziPorudzbinuDto
                    {
                        Message = "Uspesno otkazana porudzbina",
                        PorudzbinaDto = _mapper.Map<PorudzbinaDto>(otkazivanjePorudzbina)
                    };

                    await _porudzbinaRepozitorijum.SacuvajIzmjene();
                    return otkazanaPorudzbinaDto;
                }
                else
                {
                    return new OtkaziPorudzbinuDto { PorudzbinaDto = null, Message = "Nije moguce otkazati porudzbinu nakon sat vremena" };
                }
            }
            catch (Exception e)
            {

                Console.WriteLine(e.Message);

                return new OtkaziPorudzbinuDto { PorudzbinaDto = null, Message = "Desio se neki problem" };
            }
        }

        public async Task<PorudzbinaDto> UpdatePorudzbina(long id, PorudzbinaDto updatePorudzbinaDto)
        {
            Porudzbina updatePorudzbina = await _porudzbinaRepozitorijum.GetPorudzbinaById(id);
            UpdatePorudzbinaFields(updatePorudzbina, updatePorudzbinaDto);

            await _porudzbinaRepozitorijum.SacuvajIzmjene();

            return _mapper.Map<PorudzbinaDto>(updatePorudzbina);
        }

        public static void UpdatePorudzbinaFields(Porudzbina porudzbina, PorudzbinaDto porudzbinaDto)
        {
            porudzbina.Komentar = porudzbinaDto.Komentar;
            porudzbina.AdresaDostave = porudzbinaDto.AdresaDostave;
            porudzbina.StatusPorudzbine = porudzbinaDto.StatusPorudzbine;
        }

        public async Task<List<ArtikalDto>> DobaviArtiklePorudzbineZaProdavca(long porudzbinaId, long prodavacId)
        {
            //var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("id");

            //if (userIdClaim == null)
            //{
            //    throw new Exception("ID korisnika nije pronađen u claim-u.");
            // }

            // if (!long.TryParse(userIdClaim.Value, out long prodavacId))
            //{
            //    throw new Exception("Nije moguće pretvoriti ID korisnika u broj.");
            // }

            Porudzbina porudzbina = await _porudzbinaRepozitorijum.GetPorudzbinaById(porudzbinaId);

            List<ElementPorudzbine> elementiPorudzbine = porudzbina.ElementiPorudzbine;

            Korisnik prodavac = await _korisnikRepozitorijum.GetKorisnikById(prodavacId);

            List<Artikal> artikli = prodavac.ArtikliProdavac;

            List<Artikal> artikliRezultat = new List<Artikal>();

            foreach (ElementPorudzbine element in elementiPorudzbine)
            {
                foreach (Artikal artikal in artikli)
                {
                    if (element.IdArtikal == artikal.Id)
                    {
                        artikliRezultat.Add(artikal);
                    }

                }
            }
            //List<Artikal> artikli = await _porudzbinaRepozitorijum.DobaviArtiklePorudzbineZaProdavca(porudzbinaId, prodavacId);

            return _mapper.Map<List<ArtikalDto>>(artikliRezultat);
        }


        /*public async Task<List<ArtikalDto>> DobaviArtiklePorudzbine(long porudzbinaId)
        {
            var artikli = await _porudzbinaRepozitorijum.DobaviArtiklePorudzbine(porudzbinaId);
            return _mapper.Map<List<ArtikalDto>>(artikli);
        }*/
    }
}
