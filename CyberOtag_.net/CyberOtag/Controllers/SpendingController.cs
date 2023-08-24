using Microsoft.AspNetCore.Mvc;
using DbAccess.DBModels;
using Service.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpendingController : ControllerBase
    {
        private readonly DService _spendingService;

        public SpendingController(DService spendingService)
        {
            _spendingService = spendingService;
        }

        [HttpGet]
        public IActionResult GetAllSpendings()
        {
            List<Spending> allSpendings = _spendingService.GetAllSpendings();
            return Ok(allSpendings);
        }

        [HttpGet("{spendingId}")]
        public IActionResult GetSpendingById(int spendingId)
        {
            Spending spendingData = _spendingService.GetSpendingById(spendingId);
            if (spendingData == null)
            {
                return NotFound();
            }
            return Ok(spendingData);
        }

        [HttpPost]
        public IActionResult AddSpending([FromBody] Spending spendingToAdd)
        {
            _spendingService.AddSpending(spendingToAdd);
            return Ok();
        }

        [HttpPut("{spendingId}")]
        public IActionResult UpdateSpending(int spendingId, [FromBody] Spending updatedSpending)
        {
            if (_spendingService.GetSpendingById(spendingId) == null)
            {
                return NotFound();
            }
            updatedSpending.Spendingid = spendingId;
            _spendingService.UpdateSpending(updatedSpending);
            return Ok();
        }

        [HttpDelete("{spendingId}")]
        public IActionResult DeleteSpending(int spendingId)
        {
            if (_spendingService.GetSpendingById(spendingId) == null)
            {
                return NotFound();
            }
            _spendingService.DeleteSpending(spendingId);
            return Ok();
        }

    }       
}
