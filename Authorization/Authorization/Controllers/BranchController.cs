using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController(IBranchService _branchService) : ControllerBase
    {
        [HttpGet("getallbranches")]
        [Authorize(Roles = "Admin,SuperAdmin,Employee")]
        public async Task<IActionResult> GetAllBranches()
        {
            var result = await _branchService.GetAllBranches();

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }

        [HttpPost("addbranch")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> AddBranch([FromBody] BranchDto branchDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _branchService.AddBranch(branchDto);

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

        [HttpPut("updatebranch")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateBranch([FromBody] BranchDto branchDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _branchService.UpdateBranch(branchDto);

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

        [HttpDelete("deletebrach{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteBranch(Guid id)
        {
            var result = await _branchService.DeleteBranch(id);

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

        [HttpGet("getbranchbyid/{id}")]
        public async Task<IActionResult> GetBranchById(Guid id)
        {
            var result = await _branchService.GetBranchById(id);

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