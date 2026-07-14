using Authorization.DTOs;
using Authorization.GenericResponse;
using Authorization.IServices;
using Microsoft.AspNetCore.Mvc;



namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaryController (ISalaryService _salaryService): ControllerBase
    {
        [HttpPost("addsalary")]
        public async Task<IActionResult> AddSalary(SalaryDto salaryDto) {
            var result = await _salaryService.AddSalary(salaryDto);

            if(result.Item1 == 0)
            {
                return Conflict(ResponseResult<string>.Failure(null,result.Item2));
            }


            return Ok(ResponseResult<string>.Success(null, result.Item2));
        
        }

        [HttpPut("updatesalary")]
        public async Task<IActionResult> UpdateSalary(SalaryDto salaryDto)
        {
            var result = await _salaryService.UpdateSalary(salaryDto);

            return Ok(ResponseResult<string>.Success(null, result.Item2));
            
        }

        [HttpGet("salaries")]
        public async Task<IActionResult> getSalaries()
        {
            var result = await _salaryService.GetAllSalaries();
            return Ok(ResponseResult<List<SalaryDto>>.Success(result.Item1, result.Item2));
        }
    }
}
