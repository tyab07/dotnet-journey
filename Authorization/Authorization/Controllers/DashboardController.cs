using Authorization.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController(IDashboardService _dashboardService) : ControllerBase
    {
        [HttpGet("getDashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            return Ok(await _dashboardService.GetDashboard());
        }

        [HttpGet("department/{departmentId}/employees")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetEmployeesByDepartment(Guid departmentId)
        {
            var result = await _dashboardService.GetEmployeesByDepartment(departmentId);
            return Ok(new { Success = true, Data = result });
        }

        [HttpGet("branch/{branchId}/employees")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetEmployeesByBranch(Guid branchId)
        {
            var result = await _dashboardService.GetEmployeesByBranch(branchId);
            return Ok(new { Success = true, Data = result });
        }

        [HttpGet("designation/{designationId}/employees")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetEmployeesByDesignation(Guid designationId)
        {
            var result = await _dashboardService.GetEmployeesByDesignation(designationId);
            return Ok(new { Success = true, Data = result });
        }
    }
}
