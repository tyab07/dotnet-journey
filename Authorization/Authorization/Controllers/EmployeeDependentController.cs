using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeDependentController(IEmployeeDependentService _dependentService) : ControllerBase
    {
        [HttpGet("getalldependents")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetAllDependents()
        {
            var result = await _dependentService.GetAllDependents();

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }

        [HttpGet("getdependentsbyemployee/{employeeId}")]
        public async Task<IActionResult> GetDependentsByEmployeeId(Guid employeeId)
        {
            var result = await _dependentService.GetDependentsByEmployeeId(employeeId);

            if (!result.Item1.Any())
                return NotFound(new
                {
                    Success = false,
                    Message = "No dependents found for this employee!"
                });

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }

        [HttpPost("adddependent")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> AddDependent([FromBody] EmployeeDependentDto dependentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _dependentService.AddDependent(dependentDto);

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

        [HttpPut("updatedependent")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateDependent([FromBody] EmployeeDependentDto dependentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _dependentService.UpdateDependent(dependentDto);

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

        [HttpDelete("deletedependent/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteDependent(Guid id)
        {
            var result = await _dependentService.DeleteDependent(id);

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

        [HttpGet("getdependentbyid/{id}")]
        public async Task<IActionResult> GetDependentById(Guid id)
        {
            var result = await _dependentService.GetDependentById(id);

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
