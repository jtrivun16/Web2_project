using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using ProjekatWeb2.Dto;
using ProjekatWeb2.Enumerations;
using ProjekatWeb2.Interfaces;
using ProjekatWeb2.Models;
using ProjekatWeb2.Repository.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static System.Collections.Specialized.BitVector32;


namespace ProjekatWeb2.Services
{
    public class KorisnikService : IKorisnikService
    {
        private readonly IMapper _mapper;
        private readonly IKorisnikRepozitorijum _korisnikRepozitorijum;
        private readonly IConfigurationSection _secretKey;
        private readonly IAuthService _authService;


        public KorisnikService(IKorisnikRepozitorijum korisnikRepozitorijum, IAuthService authService, IMapper mapper, IConfiguration configuration)
        {
            _korisnikRepozitorijum = korisnikRepozitorijum;
            _mapper = mapper;
            _secretKey = configuration.GetSection("SecretKey");
            _authService = authService;
        }

        public async Task<KorisnikDto> AddKorisnik(KorisnikDto newKorisnikDto)
        {
            Korisnik newKorisnik = _mapper.Map<Korisnik>(newKorisnikDto);
            newKorisnik.Lozinka = BCrypt.Net.BCrypt.HashPassword(newKorisnik.Lozinka);
            await _korisnikRepozitorijum.AddKorisnik(newKorisnik);

            return _mapper.Map<KorisnikDto>(newKorisnik);
        }



        public async Task<IspisDto> Login(LoginDto loginKorisnikDto)
        {
            Korisnik loginKorisnik = new Korisnik();
            if (string.IsNullOrEmpty(loginKorisnikDto.Email) && string.IsNullOrEmpty(loginKorisnikDto.Lozinka))
            {
                return new IspisDto("Niste uneli email ili lozinku.");
            }


            loginKorisnik = await _korisnikRepozitorijum.GetKorisnikByEmail(loginKorisnikDto.Email);

            if (loginKorisnik == null)
                return new IspisDto($"Korisnik sa emailom {loginKorisnikDto.Email} ne postoji");



            if (BCrypt.Net.BCrypt.Verify(loginKorisnikDto.Lozinka, loginKorisnik.Lozinka))
            {
                List<Claim> claims = new List<Claim>();
                if (loginKorisnik.TipKorisnika == TipKorisnika.Administrator)
                    claims.Add(new Claim(ClaimTypes.Role, "administrator"));
                if (loginKorisnik.TipKorisnika == TipKorisnika.Kupac)
                    claims.Add(new Claim(ClaimTypes.Role, "kupac"));
                if (loginKorisnik.TipKorisnika == TipKorisnika.Prodavac)
                    claims.Add(new Claim(ClaimTypes.Role, "prodavac"));


                SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
                SigningCredentials signInCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                JwtSecurityToken tokenOptions = new JwtSecurityToken(
                    issuer: "http://localhost:7273",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(50),
                    signingCredentials: signInCredentials
                    );

                string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                KorisnikDto korisnikDto = _mapper.Map<KorisnikDto>(loginKorisnik);

                IspisDto ispis = new IspisDto(token, korisnikDto, "Uspesno ste se logovali na sistem");
                return ispis;
            }
            else
            {
                return new IspisDto("Lozinka nije ispravno uneta");
            }
        }

        public async Task<IspisDto> Registration(KorisnikDto registerKorisnik)
        {
            if (string.IsNullOrEmpty(registerKorisnik.Email)) //ako nije unet email, baci gresku
                return new IspisDto("Niste uneli email");

            var korisnici = await _korisnikRepozitorijum.GetAllKorisnici();

            if (korisnici != null)
            {
                foreach (Korisnik k in korisnici)
                {
                    if (k.Email == registerKorisnik.Email)
                        return new IspisDto("Email vec postoji");
                }
            }


            if (registerKorisnik.TipKorisnika == TipKorisnika.Prodavac)
            {
                registerKorisnik.VerifikacijaProdavca = VerifikacijaProdavca.UProcesu;
            }

            if (registerKorisnik.TipKorisnika != TipKorisnika.Prodavac)
            {
                registerKorisnik.CenaDostave = 0;
            }


            if (!IsKorisnikFieldsValid(registerKorisnik)) //ako nisu validna polja onda nista
                return new IspisDto("Sva polja moraju biti validna");

            KorisnikDto registeredKorisnik = await AddKorisnik(registerKorisnik);

            if (registeredKorisnik == null)
                return null;

            //nema provere za password, pa odmah vracamo token
            List<Claim> claims = new List<Claim>();
            if (registerKorisnik.TipKorisnika == TipKorisnika.Administrator)
                claims.Add(new Claim(ClaimTypes.Role, "administrator"));
            if (registerKorisnik.TipKorisnika == TipKorisnika.Prodavac)
                claims.Add(new Claim(ClaimTypes.Role, "prodavac"));
            if (registerKorisnik.TipKorisnika == TipKorisnika.Kupac)
                claims.Add(new Claim(ClaimTypes.Role, "kupac"));


            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            SigningCredentials signInCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            JwtSecurityToken tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:7273",
                claims: claims,
                expires: DateTime.Now.AddMinutes(50),
                signingCredentials: signInCredentials
                );
            string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            IspisDto ispis = new IspisDto(token, registeredKorisnik, "Uspesno ste se registrovali");
            return ispis;
        }

        public static bool IsKorisnikFieldsValid(KorisnikDto korisnikDto)
        {
            if (string.IsNullOrEmpty(korisnikDto.KorisnickoIme))
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Email))
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Lozinka))
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Ime))
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Prezime))
                return false;
            if (korisnikDto.DatumRodjenja > DateTime.Now)
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Adresa))
                return false;
            if (korisnikDto.CenaDostave == 0 && korisnikDto.TipKorisnika == TipKorisnika.Prodavac)
                return false;

            return true;
        }

        public static bool IsUpdateKorisnikFieldsValid(KorisnikDto korisnikDto)
        {
            if (string.IsNullOrEmpty(korisnikDto.KorisnickoIme))
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Email))
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Lozinka))
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Ime))
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Prezime))
                return false;
            if (korisnikDto.DatumRodjenja > DateTime.Now)
                return false;
            if (string.IsNullOrEmpty(korisnikDto.Adresa))
                return false;


            return true;
        }

        public async Task<KorisnikDto> GetKorisnik(long id)
        {
            Korisnik korisnik = new Korisnik();
            korisnik = await _korisnikRepozitorijum.GetKorisnikById(id);
            KorisnikDto korisnikDto = _mapper.Map<KorisnikDto>(korisnik);

            return korisnikDto;
        }

        public async Task<List<KorisnikDto>> GetAllKorisnici()
        {
            var korisnici = await _korisnikRepozitorijum.GetAllKorisnici();
            return _mapper.Map<List<KorisnikDto>>(korisnici);
        }


        public async Task<KorisnikDto> UpdateKorisnik(long id, KorisnikDto updateKorisnikDto)
        {

            if (updateKorisnikDto.Lozinka.Length < 4)
            {
                throw new Exception("Lozinka mora sadržati najmanje 4 karaktera.");
            }


            Korisnik korisnik = new Korisnik();
            korisnik = await _korisnikRepozitorijum.GetKorisnikById(id);

            if (korisnik == null)
            {
                throw new Exception("Korisnik ne postoji.");

            }

            var korisnici = await _korisnikRepozitorijum.GetAllKorisnici();



            if (!IsUpdateKorisnikFieldsValid(updateKorisnikDto))
                throw new Exception("Sva polja moraju biti validna.");

            korisnik.KorisnickoIme = updateKorisnikDto.KorisnickoIme;
            korisnik.Email = updateKorisnikDto.Email;
            korisnik.Ime = updateKorisnikDto.Ime;
            korisnik.Prezime = updateKorisnikDto.Prezime;
            korisnik.Lozinka = BCrypt.Net.BCrypt.HashPassword(updateKorisnikDto.Lozinka);
            korisnik.Adresa = updateKorisnikDto.Adresa;
            korisnik.Slika = updateKorisnikDto.Slika;
            korisnik.DatumRodjenja = updateKorisnikDto.DatumRodjenja;
            korisnik.VerifikacijaProdavca = updateKorisnikDto.VerifikacijaProdavca;



            await _korisnikRepozitorijum.UpdateKorisnik(korisnik);
            return _mapper.Map<KorisnikDto>(korisnik);

            //mapiranje?
        }

        public async Task DeleteKorisnik(long id)
        {
            await _korisnikRepozitorijum.DeleteKorisnikById(id);
        }

        public async Task<List<KorisnikDto>> GetProdavci()
        {
            var prodavci = await _korisnikRepozitorijum.SviProdavci();
            return _mapper.Map<List<KorisnikDto>>(prodavci);
        }

        public async Task<List<KorisnikDto>> VerifyProdavac(long id, string statusVerifikacije)
        {
            var prodavci = await _korisnikRepozitorijum.VerifikujProdavca(id, statusVerifikacije);

            return _mapper.Map<List<KorisnikDto>>(prodavci);
        }

        public async Task<IspisDto> LoginGoogle(ExternalRegister googleToken)
        {
            GoogleLoginDto socialInfo;

            socialInfo = await _authService.VerifyGoogleToken(googleToken);

            if (socialInfo == null)
                return null;

            Korisnik korisnik = await _korisnikRepozitorijum.GetKorisnikByEmail(socialInfo.Email);

            if (korisnik == null)
            {
                korisnik = new Korisnik()
                {
                    Email = socialInfo.Email,
                    KorisnickoIme = socialInfo.Email.Substring(0, socialInfo.Email.IndexOf("@")),
                    Ime = socialInfo.Ime,
                    Prezime = socialInfo.Prezime,
                    Lozinka = socialInfo.Id,
                    DatumRodjenja = DateTime.Now, //Because user might have made this data private on account
                    TipKorisnika = TipKorisnika.Kupac,
                    Adresa = socialInfo.Adresa,
                    Slika = socialInfo.Slika
                };
                if (korisnik.Slika == null)
                {
                    korisnik.Slika = "slika";
                }
                if (korisnik.Adresa == null)
                {
                    korisnik.Adresa = "adresa";
                }
                await _korisnikRepozitorijum.AddKorisnik(korisnik);

            }

            List<Claim> claims = new List<Claim>();

            if (korisnik.TipKorisnika == TipKorisnika.Kupac)
                claims.Add(new Claim(ClaimTypes.Role, "kupac"));



            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            SigningCredentials signInCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            JwtSecurityToken tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:7273",
                claims: claims,
                expires: DateTime.Now.AddMinutes(50),
                signingCredentials: signInCredentials
                );

            string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            KorisnikDto korisnikDto = _mapper.Map<KorisnikDto>(korisnik);

            IspisDto ispis = new IspisDto(token, korisnikDto, "Uspesno ste se logovali na sistem");
            return ispis;

        }
    }
}
