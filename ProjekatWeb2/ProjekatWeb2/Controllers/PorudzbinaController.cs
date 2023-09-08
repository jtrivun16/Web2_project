using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjekatWeb2.Dto;
using ProjekatWeb2.Interfaces;
using System.Data;

namespace ProjekatWeb2.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class PorudzbinaController : ControllerBase
    {
        private readonly IPorudzbinaService _porudzbinaService;

        public PorudzbinaController(IPorudzbinaService porudzbinaService)
        {
            _porudzbinaService = porudzbinaService;
        }

        [HttpPost("addPorudzbina")]
        [Authorize(Roles = "kupac")]
        public async Task<IActionResult> CreatePorudzbina([FromBody] PorudzbinaDto porudzbina)
        {
            PorudzbinaDto newPorudzbinaDto = await _porudzbinaService.AddPorudzbina(porudzbina);
            if (newPorudzbinaDto == null)
            {
                return BadRequest("Postoji neki problem prilikom dodavanja porudzbine");
            }
            return Ok(newPorudzbinaDto);
        }

        [HttpPut("otkaziPorudzbinu/{id}")]
        //[Authorize(Roles = "kupac")]
        public async Task<IActionResult> OtkaziPorudzbine(long id, [FromBody] string statusVerifikacije)
        {
            OtkaziPorudzbinuDto otkazanaPorudzbinaDto = await _porudzbinaService.OtkaziPorudzbinu(id, statusVerifikacije);
            if (otkazanaPorudzbinaDto.PorudzbinaDto == null)
            {
                return BadRequest(otkazanaPorudzbinaDto);
            }
            return Ok(otkazanaPorudzbinaDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePorudzbina(long id)
        {
            await _porudzbinaService.DeletePorudzbina(id);

            return Ok($"Porudzbina id {id} je uspesno obrisana");
        }

        [HttpGet]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> GetAllPorudzbine()
        {
            return Ok(await _porudzbinaService.GetAllPorudzbina());
        }

        [HttpGet("getKupcevePorudzbine/{id}")]
        [Authorize(Roles = "kupac")]
        public async Task<IActionResult> GetKupcevePorudzbine(long id) // id kupca
        {
            List<PorudzbinaDto> korisnikovePorudzbineDto = await _porudzbinaService.GetKupcevePorudzbine(id);
            if (korisnikovePorudzbineDto == null)
            {
                return BadRequest("Ne postoji korisnik sa datim id");
            }
            return Ok(korisnikovePorudzbineDto);
        }

        [HttpGet("{id}")]
        //[Authorize(Roles = "kupac,prodavac,administrator")]
        public async Task<IActionResult> GetById(long id) //id porudzbine
        {
            PregledPorudzbineDto porudzbinaPregledDto = await _porudzbinaService.GetPorudzbinaById(id);
            if (porudzbinaPregledDto == null)
            {
                return BadRequest("Porudzbina ne postoji");
            }

            return Ok(porudzbinaPregledDto);
        }

        [HttpGet("getProdavceveNovePorudzbine/{id}")]
        [Authorize(Roles = "prodavac")]
        public async Task<IActionResult> GetProdavceveNovePorudzbine(long id) //prodavcev id
        {
            List<PorudzbinaDto> prodavcevePorudzbine = await _porudzbinaService.GetProdavceveNovePorudzbine(id);
            if (prodavcevePorudzbine == null)
            {
                return BadRequest("Greska pri dobavljanju prodavcevih porudzbina!");
            }

            return Ok(prodavcevePorudzbine);
        }

        [HttpGet("getProdavcevePrethodnePorudzbine/{id}")]
        [Authorize(Roles = "prodavac")]
        public async Task<IActionResult> GetProdavcevePrethodnePorudzbine(long id) //prodavcev id
        {
            List<PorudzbinaDto> prodavcevePrethodnePorudzbineDto = await _porudzbinaService.GetProdavcevePrethodnePorudzbine(id);
            if (prodavcevePrethodnePorudzbineDto == null)
            {
                return BadRequest("Nisu lepo ucitane prodavceve produzbine");
            }
            return Ok(prodavcevePrethodnePorudzbineDto);

        }



        [HttpPut("{id}")]
        public async Task<IActionResult> ChangePorudzbina(long id, [FromBody] PorudzbinaDto porudzbina)
        {
            return Ok(await _porudzbinaService.UpdatePorudzbina(id, porudzbina));
        }

        [HttpGet("{porudzbinaId}/artikliProdavca/{prodavacId}")]
        [Authorize(Roles = "prodavac")]
        public async Task<IActionResult> DobaviArtiklePorudzbineZaProdavca(long porudzbinaId, long prodavacId)
        {
            List<ArtikalDto> artikli = await _porudzbinaService.DobaviArtiklePorudzbineZaProdavca(porudzbinaId, prodavacId);

            if (artikli.Count == 0)
            {
                return NotFound("prazna");
            }

            return Ok(artikli);

        }
    }
}
