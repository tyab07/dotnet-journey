using Authorization.DTOs;
using Authorization.GenericResponse;
using Authorization.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]

       
        public async Task<IActionResult> Login(UserDto user)
        {
            try
            {
             
                var result = await _authService.loginUser(user);
                if (result.Item1 == 0)
                {
                    return NotFound(ResponseResult<string>.Failure(null, message: result.Item2));
                }
                if (result.Item1 == 1)
                {
                    return BadRequest(ResponseResult<string>.Failure(null, message : result.Item2));
                }
                return Ok(ResponseResult<string>.Success(null, result.Item2));
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpPost("register")]

        public async Task<IActionResult> Registration(UserDto userDto)
        {
            try
            {

                var result = await _authService.RegisterUser(userDto);

                if (result.Item1 == 0)
                {
                    return Ok(ResponseResult<string>.Failure(null, message: result.Item2));
                }
                return Ok(ResponseResult<string>.Success(null, message: result.Item2));
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }


    }
}
