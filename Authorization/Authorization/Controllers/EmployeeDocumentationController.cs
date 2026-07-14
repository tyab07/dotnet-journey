using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeDocumentationController(IEmployeeDocumentationService _documentationService) : ControllerBase
    {
        [HttpGet("getalldocumentations")]
        public async Task<IActionResult> GetAllDocumentations()
        {
            var result = await _documentationService.GetAllDocumentations();

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }

        [HttpPost("adddocumentation")]
        public async Task<IActionResult> AddDocumentation([FromBody] EmployeeDocumentationDto documentationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _documentationService.AddDocumentation(documentationDto);

            if (result.Item1 == 0)
                return BadRequest(new
                {
                    Success = false,
                    Message = result.Item2
                });

            return Ok(new
            {
                Success = true,
                Message = result.Item2
            });
        }

        [HttpPut("updatedocumentation")]
        public async Task<IActionResult> UpdateDocumentation([FromBody] EmployeeDocumentationDto documentationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _documentationService.UpdateDocumentation(documentationDto);

            if (result.Item1 == 0)
                return NotFound(new
                {
                    Success = false,
                    Message = result.Item2
                });

            return Ok(new
            {
                Success = true,
                Message = result.Item2
            });
        }

        [HttpDelete("deletedocumentation/{id}")]
        public async Task<IActionResult> DeleteDocumentation(Guid id)
        {
            var result = await _documentationService.DeleteDocumentation(id);

            if (result.Item1 == 0)
                return NotFound(new
                {
                    Success = false,
                    Message = result.Item2
                });

            return Ok(new
            {
                Success = true,
                Message = result.Item2
            });
        }
    }
}
