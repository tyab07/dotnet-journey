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
        public async Task<IActionResult> AddSalary(SalaryDto _salaryDto) {
            var result = await _salaryService.AddSalary(_salaryDto);

            if(result.Item1 == 0)
            {
                return Conflict(ResponseResult<string>.Failure(null,result.Item2));
            }


            return Ok(ResponseResult<string>.Success(null, result.Item2));
        
        }
    }
}
