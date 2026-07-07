using Authorization.DTOs;
using Authorization.GenericResponse;
using Authorization.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController(IEmployeeService _employeeService) : ControllerBase
    {
        [HttpGet("GetAllEmployees")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var result  = await _employeeService.GetAllEmployeesAsync();

            if(!result.Item2.Any())
            {
                return Ok(ResponseResult<List<EmployeeDto>>.Failure(null,"No Employee Found!"));
            }

            return Ok(ResponseResult<List<EmployeeDto>>.Success(result.Item2, "Employee Found!"));
        }

        [HttpPost("RegisterEmployee")]
        public async Task<IActionResult> RegisterEmployee(EmployeeDto employeeDto)
        {
            var result = await _employeeService.RegisterEmployee(employeeDto);
            if(result.Item1 == 1 )
            {
                return Ok(ResponseResult<EmployeeDto>.Success(result.Item2, result.Item3));
            }
            if(result.Item1 == 2)
            {
                return Ok(ResponseResult<EmployeeDto>.Success(result.Item2, result.Item3));
            }
            return NotFound(ResponseResult<EmployeeDto>.Failure(null, "OOPS! Some thing went wrong..."));
        }

        //[HttpPatch("UpdateEmployee")]
        //public async Task<IActionResult> UpdateEmploye(EmployeeDto employeeDto)
        //{

        //}
    }
}
