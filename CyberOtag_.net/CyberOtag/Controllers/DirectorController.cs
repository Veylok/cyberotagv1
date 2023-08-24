using Microsoft.AspNetCore.Mvc;
using DbAccess.DBModels;
using Service.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorController : ControllerBase
    {
        private readonly DService _directorService;

        public DirectorController(DService directorService)
        {
            _directorService = directorService;
        }

        [HttpGet]
        public IActionResult GetAllDirectors()
        {
            List<Director> allDirectors = _directorService.GetAllDirectors();
            return Ok(allDirectors);
        }

        [HttpGet("{directorId}")]
        public IActionResult GetDirectorById(int directorId)
        {
            Director directorData = _directorService.GetDirectorById(directorId);
            if (directorData == null)
            {
                return NotFound();
            }
            return Ok(directorData);
        }

        [HttpPost]
        public IActionResult AddDirector([FromBody] Director directorToAdd)
        {
            _directorService.AddDirector(directorToAdd);
            return Ok();
        }

        [HttpPut("{directorId}")]
        public IActionResult UpdateDirector(int directorId, [FromBody] Director updatedDirector)
        {
            if (_directorService.GetDirectorById(directorId) == null)
            {
                return NotFound();
            }
            updatedDirector.Directorid = directorId;
            _directorService.UpdateDirector(updatedDirector);
            return Ok();
        }

        [HttpDelete("{directorId}")]
        public IActionResult DeleteDirector(int directorId)
        {
            if (_directorService.GetDirectorById(directorId) == null)
            {
                return NotFound();
            }
            _directorService.DeleteDirector(directorId);
            return Ok();
        }
    }
}
