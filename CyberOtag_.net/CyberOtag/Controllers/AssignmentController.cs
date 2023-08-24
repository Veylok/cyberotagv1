using Microsoft.AspNetCore.Mvc;
using DbAccess.DBModels;
using Service.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly DService _assignmentService;

        public AssignmentController(DService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpGet]
        public IActionResult GetAllAssignments()
        {
            var assignments = _assignmentService.GetAllAssignments();
            return Ok(assignments);
        }

        [HttpGet("{assignmentId}")]
        public IActionResult GetAssignmentById(int assignmentId)
        {
            var assignment = _assignmentService.GetAssignmentById(assignmentId);
            if (assignment == null)
            {
                return NotFound();
            }
            return Ok(assignment);
        }

        [HttpPost]
        public IActionResult AddAssignment([FromBody] Assignment assignmentToAdd)
        {
            _assignmentService.AddAssignment(assignmentToAdd);
            return Ok();
        }

        [HttpPut("{assignmentId}")]
        public IActionResult UpdateAssignment(int assignmentId, [FromBody] Assignment updatedAssignment)
        {
            if (_assignmentService.GetAssignmentById(assignmentId) == null)
            {
                return NotFound();
            }
            updatedAssignment.Assignmentid = assignmentId;
            _assignmentService.UpdateAssignment(updatedAssignment);
            return Ok();
        }

        [HttpDelete("{assignmentId}")]
        public IActionResult DeleteAssignment(int assignmentId)
        {
            if (_assignmentService.GetAssignmentById(assignmentId) == null)
            {
                return NotFound();
            }
            _assignmentService.DeleteAssignment(assignmentId);
            return Ok();
        }
    }
}

