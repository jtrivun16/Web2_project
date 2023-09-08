using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjekatWeb2.Dto;
using ProjekatWeb2.Interfaces;
using ProjekatWeb2.Models;
using System.Data;

namespace ProjekatWeb2.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class KorisnikController : ControllerBase
    {
        private readonly IKorisnikService _korisnikService;
        private readonly IEmailService _emailService;

        public KorisnikController(IKorisnikService korisnikService, IEmailService emailService)
        {
            _korisnikService = korisnikService;
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateKorisnik([FromBody] KorisnikDto korisnik)
        {
            return Ok(await _korisnikService.AddKorisnik(korisnik));
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<Korisnik>> GetAllKorisnici()
        {
            List<KorisnikDto> korisnici = new List<KorisnikDto>();
            korisnici = await _korisnikService.GetAllKorisnici();
            if (korisnici == null)
            {
                return NotFound("Ne postoje korisnici");
            }

            return Ok(korisnici);
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Korisnik>> GetKorisnik(long id)
        {
            KorisnikDto korisnik = await _korisnikService.GetKorisnik(id);
            if (korisnik == null)
            {
                return NotFound();
            }

            return Ok(korisnik);
        }

        [HttpPost("loginExternal")]
        public async Task<IActionResult> GoogleLogin([FromBody] ExternalRegister googleToken)
        {
            try
            {
                IspisDto rezultatPrijave = await _korisnikService.LoginGoogle(googleToken);

                return Ok(rezultatPrijave);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginKorisnikDto)
        {
            IspisDto ispis = await _korisnikService.Login(loginKorisnikDto);
            if (ispis.KorisnikDto == null)
            {
                return BadRequest(ispis.Result);
            }

            ispis.KorisnikDto.Lozinka = loginKorisnikDto.Lozinka;
            return Ok(ispis);
        }

        [HttpPost("registration")]
        public async Task<IActionResult> Registration([FromBody] KorisnikDto registerKorisnikDto)
        {
            IspisDto ispis = await _korisnikService.Registration(registerKorisnikDto);
            if (ispis.KorisnikDto == null)
                return BadRequest(ispis.Result);

            ispis.KorisnikDto.Lozinka = registerKorisnikDto.Lozinka;
            return Ok(ispis);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ChangeKorisnik(long id, [FromBody] KorisnikDto korisnik)
        {
            KorisnikDto updatedKorisnik = await _korisnikService.UpdateKorisnik(id, korisnik);
            if (updatedKorisnik == null)
            {
                return BadRequest("Postoje neka prazna polja(mozda korisnik ne postoji)");
            }

            updatedKorisnik.Lozinka = korisnik.Lozinka;
            return Ok(updatedKorisnik);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKorisnik(long id)
        {
            await _korisnikService.DeleteKorisnik(id);
            return Ok($"Korisnik sa id = {id} je uspesno obrisan.");
        }

        [HttpGet("getProdavci")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> GetProdavci()
        {
            return Ok(await _korisnikService.GetProdavci());
        }


        [HttpPut("verifyProdavca/{id}")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> VerifyProdavca(long id, [FromBody] string statusVerifikacije)
        {
            List<KorisnikDto> verifiedProdavci = await _korisnikService.VerifyProdavac(id, statusVerifikacije);
            if (verifiedProdavci == null)
            {
                return BadRequest("Ne postoji prodavac");
            }

            KorisnikDto prodavac = await _korisnikService.GetKorisnik(id);
            _emailService.SendEmail(prodavac.Email, statusVerifikacije);

            return Ok(verifiedProdavci);
        }
    }
}
