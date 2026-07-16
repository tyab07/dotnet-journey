using Authorization.DTOs;
using Authorization.GenericResponse;
using Authorization.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaryController (ISalaryService _salaryService): ControllerBase
    {
        [HttpPost("addsalary")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> AddSalary(SalaryDto salaryDto) {
            var result = await _salaryService.AddSalary(salaryDto);

            if(result.Item1 == 0)
            {
                return Conflict(ResponseResult<string>.Failure(null,result.Item2));
            }


            return Ok(ResponseResult<string>.Success(null, result.Item2));
        
        }

        [HttpPut("updatesalary")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateSalary(SalaryDto salaryDto)
        {
            var result = await _salaryService.UpdateSalary(salaryDto);

            return Ok(ResponseResult<string>.Success(null, result.Item2));
            
        }

        [HttpGet("salaries")]
        [Authorize(Roles = "Admin,SuperAdmin,Employee")]
        public async Task<IActionResult> getSalaries()
        {
            if (User.IsInRole("Employee"))
            {
                var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(email))
                {
                    return Ok(ResponseResult<List<SalaryDto>>.Failure(null, "User email not found in token."));
                }
                var resultByEmail = await _salaryService.GetSalariesByEmployeeEmail(email);
                return Ok(ResponseResult<List<SalaryDto>>.Success(resultByEmail.Item1, resultByEmail.Item2));
            }

            var result = await _salaryService.GetAllSalaries();
            return Ok(ResponseResult<List<SalaryDto>>.Success(result.Item1, result.Item2));
        }

        [HttpGet("getsalarybyid/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetSalaryById(Guid id)
        {
            var result = await _salaryService.GetSalaryById(id);
            if (result.Item1 == null)
            {
                return NotFound(ResponseResult<SalaryDto>.Failure(null, result.Item2));
            }
            return Ok(ResponseResult<SalaryDto>.Success(result.Item1, result.Item2));
        }
    }
}
