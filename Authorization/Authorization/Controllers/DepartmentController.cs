using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController(IDepartmentService _departmentService) : ControllerBase
    {
        [HttpGet("getAllDepartment")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetAllDepartments()
        {
            var result = await _departmentService.GetAllDepartments();

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }

        [HttpPost("addDepartment")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> AddDepartment([FromBody] DepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _departmentService.AddDepartment(departmentDto);

            if (result.Item1 == 0)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = result.Item2
                });
            }

            return Ok(new
            {
                Success = true,
                Message = result.Item2
            });
        }

        [HttpPut("updateDepartment")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateDepartment([FromBody] DepartmentDto departmentDto)
        {
           

            var result = await _departmentService.UpdateDepartment(departmentDto);

            if (result.Item1 == 0)
            {
                return NotFound(new
                {
                    Success = false,
                    Message = result.Item2
                });
            }

            return Ok(new
            {
                Success = true,
                Message = result.Item2
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteDepartment(Guid id)
        {
            var result = await _departmentService.DeleteDepartment(id);

            if (result.Item1 == 0)
            {
                return NotFound(new
                {
                    Success = false,
                    Message = result.Item2
                });
            }

            return Ok(new
            {
                Success = true,
                Message = result.Item2
            });
        }

        [HttpGet("getdepartmentbyid/{id}")]
        public async Task<IActionResult> GetDepartmentById(Guid id)
        {
            var result = await _departmentService.GetDepartmentById(id);

            if (result.Item1 == null)
            {
                return NotFound(new
                {
                    Success = false,
                    Message = result.Item2
                });
            }

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }
    }
}