using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using RouteAttribute = Microsoft.AspNetCore.Components.RouteAttribute;


namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaryController (ISalaryService _salaryService): ControllerBase
    {
        [HttpPost("post")]
        public async Task<IActionResult> AddSalary(SalaryDto _salaryDto) {
            var result = await _salaryService.AddSalary(_salaryDto);

            return Ok();
        
        }
    }
}
