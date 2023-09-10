using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjekatWeb2.Dto;
using ProjekatWeb2.Interfaces;
using System.Data;

namespace ProjekatWeb2.Controllers
{
    [Route("api/articles")]
    [ApiController]
    public class ArtikalController : ControllerBase
    {
        private readonly IArtikalService _artikalService;

        public ArtikalController(IArtikalService artikalService)
        {
            _artikalService = artikalService;
        }

        [HttpPost("addArtikal")]
        [Authorize(Roles = "prodavac")]
        public async Task<IActionResult> AddArtikal([FromBody] ArtikalDto artikal)
        {
            ArtikalDto newArtikalDto = await _artikalService.AddArtikal(artikal);
            if (newArtikalDto == null)
            {
                return BadRequest("Polja nisu dobro popunjena ili prodavac ne postoji");
            }
            return Ok(newArtikalDto);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "prodavac")]
        public async Task<IActionResult> DeleteArtikal(long id)
        {
            bool response = await _artikalService.DeleteArtikal(id);
            if (!response)
            {
                return BadRequest("Artikal ne postoji ili nije uspesno obrisan");
            }
            return Ok($"Artikal id {id} je uspesno obrisan");
        }


        [HttpGet]
        public async Task<IActionResult> GetArtikli()
        {
            return Ok(await _artikalService.GetAllArtikals());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "prodavac")]
        public async Task<IActionResult> GetArtikalById(long id)
        {
            ArtikalDto artikal = await _artikalService.GetArtikalById(id);
            if (artikal == null)
            {
                return BadRequest("Artikal ne postoji");
            }
            return Ok(artikal);
        }

        [HttpGet("getProdavceveArtikle/{id}")]
        [Authorize(Roles = "prodavac")]
        public async Task<IActionResult> GetProdavceveArtikle(long id)
        {
            List<ArtikalDto> prodavceviArtikli = await _artikalService.GetProdavceveArtikle(id);
            if (prodavceviArtikli == null)
            {
                return BadRequest("Korisnik ne postoji");
            }
            return Ok(prodavceviArtikli);
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "prodavac")]
        public async Task<IActionResult> ChangeArtikal(long id, [FromBody] ArtikalDto artikal)
        {
            ArtikalDto updateArtikal = await _artikalService.UpdateArtikal(id, artikal);
            if (updateArtikal == null)
            {
                return BadRequest("Artikal ne postoji");
            }
            return Ok(updateArtikal);
        }
    }
}
