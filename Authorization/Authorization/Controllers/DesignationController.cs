using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesignationController(IDesignationService _designationService) : ControllerBase
    {
        [HttpGet("getalldesignations")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetAllDesignations()
        {
            var result = await _designationService.GetAllDesignations();

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }

        [HttpPost("adddesignation")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> AddDesignation([FromBody] DesignationDto designationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _designationService.AddDesignation(designationDto);

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

        [HttpPut("updatedesignation")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateDesignation([FromBody] DesignationDto designationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _designationService.UpdateDesignation(designationDto);

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

        [HttpDelete("deletedesignation/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteDesignation(Guid id)
        {
            var result = await _designationService.DeleteDesignation(id);

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

        [HttpGet("getdesignationbyid/{id}")]
        public async Task<IActionResult> GetDesignationById(Guid id)
        {
            var result = await _designationService.GetDesignationById(id);

            if (result.Item1 == null)
                return NotFound(new
                {
                    Success = false,
                    Message = result.Item2
                });

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }
    }
}
