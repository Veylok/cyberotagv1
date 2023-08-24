using Microsoft.AspNetCore.Mvc;
using DbAccess.DBModels;
using Service.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperatorController : ControllerBase
    {
        private readonly DService _operatorService;

        public OperatorController(DService operatorService)
        {
            _operatorService = operatorService;
        }

        
        [HttpGet]
        public IActionResult Get()
        {
            List<Operator> allOperators = _operatorService.TumOperatorleriGetir();
            return Ok(allOperators);
        }

       
        [HttpGet("{operatorId}")]
        public IActionResult Get(int operatorId)
        {
            Operator operatorData = _operatorService.Getir(operatorId);
            if (operatorData == null)
            {
                return NotFound();
            }
            return Ok(operatorData);
        }

        
        [HttpPost]
        public IActionResult Post([FromBody] Operator operatorToAdd)
        {
            _operatorService.Ekle(operatorToAdd);
            return Ok();
        }

        [HttpPut("{operatorId}")]
        public IActionResult Put(int operatorId, [FromBody] Operator updatedOperator)
        {
            if (_operatorService.Getir(operatorId) == null)
            {
                return NotFound();
            }
            updatedOperator.Operatorid = operatorId;
            _operatorService.Guncelle(updatedOperator);
            return Ok();
        }

       
        [HttpDelete("{operatorId}")]
        public IActionResult Delete(int operatorId)
        {
            if (_operatorService.Getir(operatorId) == null)
            {
                return NotFound();
            }
            _operatorService.Sil(operatorId);
            return Ok();
        }
    }
}
