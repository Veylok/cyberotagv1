using Microsoft.AspNetCore.Mvc;
using DbAccess.DBModels;
using Service.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraphicsetController : ControllerBase
    {
        private readonly DService _graphicsetService;

        public GraphicsetController(DService graphicsetService)
        {
            _graphicsetService = graphicsetService;
        }

        [HttpGet("GraphicsetsByBranch/{branchId}")]
        public IActionResult GetGraphicsetsByBranch(int branchId)
        {
            List<Graphicset> graphicsets = _graphicsetService.GetGraphicsetsByBranchId(branchId);
            return Ok(graphicsets);
        }

        [HttpGet]
        public IActionResult GetAllGraphicsets()
        {
            List<Graphicset> allGraphicsets = _graphicsetService.GetAllGraphicset();
            return Ok(allGraphicsets);
        }

        [HttpGet("GraphicsetsWithBranchNames")]

        public IActionResult GetAllGraphicsetsWithBranchNames()
        {
            List<Graphicset> allGraphicsets = _graphicsetService.GetAllGraphicsetsWithBranchNames();
            return Ok(allGraphicsets);
        }

        [HttpGet("{graphicsetId}")]
        public IActionResult GetGraphicsetById(int graphicsetId)
        {
            Graphicset graphicsetData = _graphicsetService.GetGraphicsetById(graphicsetId);
            if (graphicsetData == null)
            {
                return NotFound();
            }
            return Ok(graphicsetData);
        }

        [HttpPost]
        public IActionResult AddGraphicset([FromBody] Graphicset graphicsetToAdd)
        {
            _graphicsetService.AddGraphicset(graphicsetToAdd);
            return Ok();
        }

        [HttpPut("{graphicsetId}")]
        public IActionResult UpdateGraphicset(int graphicsetId, [FromBody] Graphicset updatedGraphicset)
        {
            if (_graphicsetService.GetGraphicsetById(graphicsetId) == null)
            {
                return NotFound();
            }
            updatedGraphicset.Graphicsetid = graphicsetId;
            _graphicsetService.UpdateGraphicset(updatedGraphicset);
            return Ok();
        }

        [HttpDelete("{graphicsetId}")]
        public IActionResult DeleteGraphicset(int graphicsetId)
        {
            if (_graphicsetService.GetGraphicsetById(graphicsetId) == null)
            {
                return NotFound();
            }
            _graphicsetService.DeleteGraphicset(graphicsetId);
            return Ok();
        }
    }
}
