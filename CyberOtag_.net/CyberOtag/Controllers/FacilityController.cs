using Microsoft.AspNetCore.Mvc;
using DbAccess.DBModels;
using Service.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacilityController : ControllerBase
    {
        private readonly DService _facilityService;

        public FacilityController(DService facilityService)
        {
            _facilityService = facilityService;
        }

        [HttpGet]
        public IActionResult GetAllFacilities()
        {
            List<Facility> allFacilities = _facilityService.GetAllFacilities();
            return Ok(allFacilities);
        }

        [HttpGet("ShowFacilitiesWithCityNames")]
        public IActionResult ShowFacilitiesWithCityNames()
        {
            var allFacilities = _facilityService.GetAllFacilitiesWithCityNames();
            return Ok(allFacilities);
        }

        [HttpGet("{facilityId}")]
        public IActionResult GetFacilityById(int facilityId)
        {
            Facility facilityData = _facilityService.GetFacilityById(facilityId);
            if (facilityData == null)
            {
                return NotFound();
            }
            return Ok(facilityData);
        }


        [HttpPost]
        public IActionResult AddFacility([FromBody] Facility facilityToAdd)
        {
            _facilityService.AddFacility(facilityToAdd);
            return Ok();
        }

        [HttpPut("{facilityId}")]
        public IActionResult UpdateFacility(int facilityId, [FromBody] Facility updatedFacility)
        {
            if (_facilityService.GetFacilityById(facilityId) == null)
            {
                return NotFound();
            }
            updatedFacility.Facilityid = facilityId;
            _facilityService.UpdateFacility(updatedFacility);
            return Ok();
        }

        [HttpDelete("{facilityId}")]
        public IActionResult DeleteFacility(int facilityId)
        {
            if (_facilityService.GetFacilityById(facilityId) == null)
            {
                return NotFound();
            }
            _facilityService.DeleteFacility(facilityId);
            return Ok();
        }

       
        [HttpGet("FilterByCity/{cityId}")]
        public IActionResult FilterFacilitiesByCity(int cityId)
        {
            List<Facility> facilitiesInCity = _facilityService.GetFacilitiesByCity(cityId);
            return Ok(facilitiesInCity);
        }
    }
}
