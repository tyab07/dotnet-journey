using Authorization.DTOs;
using Authorization.GenericResponse;
using Authorization.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController(IEmployeeService _employeeService) : ControllerBase
    {
        [HttpGet("GetAllEmployees")]
        [Authorize(Roles = "Admin,SuperAdmin,Employee")]
        public async Task<IActionResult> GetAllEmployees()
        {
            if (User.IsInRole("Employee"))
            {
                var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(email))
                {
                    return Ok(ResponseResult<List<EmployeeDto>>.Failure(null, "User email not found in token."));
                }
                var profileResult = await _employeeService.GetEmployeeByEmailAsync(email);
                if (!profileResult.Item2.Any())
                {
                    return Ok(ResponseResult<List<EmployeeDto>>.Failure(null, "No Employee Found!"));
                }
                return Ok(ResponseResult<List<EmployeeDto>>.Success(profileResult.Item2, "Employee Found!"));
            }

            var result  = await _employeeService.GetAllEmployeesAsync();

            if(!result.Item2.Any())
            {
                return Ok(ResponseResult<List<EmployeeDto>>.Failure(null,"No Employee Found!"));
            }

            return Ok(ResponseResult<List<EmployeeDto>>.Success(result.Item2, "Employee Found!"));
        }

        [HttpPost("RegisterEmployee")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> RegisterEmployee(EmployeeDto employeeDto)
        {
            var result = await _employeeService.RegisterEmployee(employeeDto);
            if (result.Item1 == 0)
            {
                return Conflict(ResponseResult<EmployeeDto>.Failure(null, result.Item3));
            }
            if (result.Item1 == 1)
            {
                return Ok(ResponseResult<EmployeeDto>.Success(result.Item2, result.Item3));
            }
            return NotFound(ResponseResult<EmployeeDto>.Failure(null, "OOPS! Some thing went wrong..."));
        }

        [HttpPut("UpdateEmployee")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateEmploye(EmployeeDto employeeDto)
        {
            try
            {
                var result = await _employeeService.UpdateEmployee(employeeDto);

                if (result.Item1 == 0)
                {
                    return NotFound(ResponseResult<EmployeeDto>.Failure(null, result.Item3));
                }

                return Ok(ResponseResult<EmployeeDto>.Success(result.Item2, result.Item3));
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        [HttpDelete("DeleteEmployee")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteEmployee(EmployeeDto employeeDto)
        {
            var result = await _employeeService.DeleteEmployee(employeeDto);

            if(result.Item1 == 0)
            {
                return NotFound(ResponseResult<EmployeeDto>.Failure(null, result.Item2));
            }

            return Ok(ResponseResult<EmployeeDto>.Success(null, result.Item2));
        }

        [HttpGet("GetEmployeeById/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetEmployeeById(Guid id)
        {
            var result = await _employeeService.GetEmployeeById(id);
            if (result.Item1 == 0)
            {
                return NotFound(ResponseResult<EmployeeDto>.Failure(null, "The User does not exist "));
            }
            return Ok(ResponseResult<EmployeeDto>.Success(result.Item2, "User Found!"));
        }
    }

}
