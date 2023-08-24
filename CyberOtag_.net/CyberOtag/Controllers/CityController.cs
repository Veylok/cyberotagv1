using Microsoft.AspNetCore.Mvc;
using DbAccess.DBModels;
using Service.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly DService _cityService;

        public CityController(DService cityService)
        {
            _cityService = cityService;
        }

        [HttpGet]
        public IActionResult GetAllCities()
        {
            List<City> allCities = _cityService.GetAllCities();
            return Ok(allCities);
        }

        [HttpGet("{cityId}")]
        public IActionResult GetCityById(int cityId)
        {
            City cityData = _cityService.GetCityById(cityId);
            if (cityData == null)
            {
                return NotFound();
            }
            return Ok(cityData);
        }

        [HttpPost]
        public IActionResult AddCity([FromBody] City cityToAdd)
        {
            _cityService.AddCity(cityToAdd);
            return Ok();
        }

        [HttpPut("{cityId}")]
        public IActionResult UpdateCity(int cityId, [FromBody] City updatedCity)
        {
            if (_cityService.GetCityById(cityId) == null)
            {
                return NotFound();
            }
            updatedCity.Cityid = cityId;
            _cityService.UpdateCity(updatedCity);
            return Ok();
        }
        [HttpGet("withnames")]
        public IActionResult GetAllCitiesWithNames()
        {
            List<City> allCities = _cityService.GetAllCities();
            return Ok(allCities);
        }


        [HttpDelete("{cityId}")]
        public IActionResult DeleteCity(int cityId)
        {
            if (_cityService.GetCityById(cityId) == null)
            {
                return NotFound();
            }
            _cityService.DeleteCity(cityId);
            return Ok();
        }
    }
}

