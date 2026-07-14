using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeTypeController(IEmployeeTypeService _employeeTypeService) : ControllerBase
    {
        [HttpGet("getallemployeetypes")]
        public async Task<IActionResult> GetAllEmployeeTypes()
        {
            var result = await _employeeTypeService.GetAllEmployeeTypes();

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }

        [HttpPost("addemployeetype")]
        public async Task<IActionResult> AddEmployeeType([FromBody] EmployeeTypeDto employeeTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _employeeTypeService.AddEmployeeType(employeeTypeDto);

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

        [HttpPut("updateemployeetype")]
        public async Task<IActionResult> UpdateEmployeeType([FromBody] EmployeeTypeDto employeeTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _employeeTypeService.UpdateEmployeeType(employeeTypeDto);

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

        [HttpDelete("deleteemployeetype/{id}")]
        public async Task<IActionResult> DeleteEmployeeType(Guid id)
        {
            var result = await _employeeTypeService.DeleteEmployeeType(id);

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
