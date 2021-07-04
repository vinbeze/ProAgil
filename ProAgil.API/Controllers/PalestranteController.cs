using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PalestranteController : ControllerBase
    {
        private readonly IProAgilRepository _repo;

        public PalestranteController(IProAgilRepository repo)
        {
            this._repo = repo;
        }

                [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var results = await _repo.getAllPalestrantesAsync(true);
                return Ok(results);    
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou"); 
            }
            
        }   

        [HttpGet("{PalestranteId}")]
        public async Task<IActionResult> Get(int PalestranteId)
        {
            try
            {
                var result = await _repo.getPalestranteAsyncById(PalestranteId,true);
                return Ok(result);    
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou"); 
            }
        }

        [HttpGet("getByName/{name}")]
        public async Task<IActionResult> Get(string name)
        {
            try
            {
                var result = await _repo.getAllPalestrantesAsyncByName(name,true);
                return Ok(result);    
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou"); 
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Palestrante model)
        {
            try
            {
                _repo.Add(model);
                if(await _repo.SaveChangesAsync()){
                    return Created($"/api/palestrante/{model.Id}",model);
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou"); 
            }

            return BadRequest();
        }

        [HttpPut("{PalestranteId}")]
        public async Task<IActionResult> Put(int PalestranteId,Palestrante model)
        {
            try
            {

                var palestrante = await _repo.getPalestranteAsyncById(PalestranteId,false);
                if(palestrante == null ) return NotFound();
                
                _repo.Update(palestrante);
                if(await _repo.SaveChangesAsync()){
                    return Created($"/api/palestrante/{model.Id}",model);
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou"); 
            }

            return BadRequest();
        }

        [HttpDelete("{PalestranteId}")]
        public async Task<IActionResult> Delete(int PalestranteId)
        {
            try
            {

                var palestrante = await _repo.getPalestranteAsyncById(PalestranteId,false);
                if(palestrante == null ) return NotFound();
                
                _repo.Delete(palestrante);
                if(await _repo.SaveChangesAsync()){
                    return Ok();
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou"); 
            }

            return BadRequest();
        }

        
    }
}