
using Authorization.Data;
using Authorization.IServices;
using Authorization.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Globalization;
using System.Security.Claims;
using System.Linq.Expressions;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
namespace Authorization.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AuthService> _logger;
        public AuthService(AppDbContext context, ILogger<AuthService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Tuple<int, TokenDto>> loginUser(UserDto userDto)
        {
            try
            {

                var tokenDto = new TokenDto();
                if(userDto == null)
                {

                    tokenDto.Token = string.Empty;
                    tokenDto.Message = "Fill all the entities";
                    
                    return new Tuple<int, TokenDto>(0, tokenDto);
                    

                }
                var existingUser = await _context.AccountUser.FirstOrDefaultAsync(u => u.Email == userDto.Email);

                if (existingUser == null)
                {

                    tokenDto.Token = string.Empty;
                    tokenDto.Message = "The User is not registered.Please Register the User";
                   
                    return new Tuple<int, TokenDto>(0, tokenDto);
                    
                }
                
                var hashedPassword = new PasswordHasher<string>();
                var verifiedpassword = hashedPassword.VerifyHashedPassword(userDto.Email, existingUser.Password, userDto.Password);

                if (verifiedpassword == PasswordVerificationResult.Success)
                {

                    var dto = new UserDto
                    {
                        Id = existingUser.Id,
                        Name = existingUser.Name,
                        Email = existingUser.Email,
                        Password = existingUser.Password
                    };
                    string role = "User";
                    if (userDto.Email == "tayyab@gmail.com")
                    {
                        role = "Admin";
                    }
                    var token = GetJwtToken(dto, role);


                    tokenDto.Token = token;
                    tokenDto.Message = "Login Successful";
                    
                    return new Tuple<int, TokenDto>(2, tokenDto);
                }
                else if (verifiedpassword == PasswordVerificationResult.SuccessRehashNeeded)
                {
                    existingUser.Password = Passwordhashing(userDto);
                    _context.AccountUser.Update(existingUser);
                    await _context.SaveChangesAsync();

                    var dto = new UserDto
                    {
                        Id = existingUser.Id,
                        Name = existingUser.Name,
                        Email = existingUser.Email,
                        Password = existingUser.Password
                    };
                    string role = "User";
                    if (userDto.Email == "tayyab@gmail.com")
                    {
                        role = "Admin";
                    }
                    var token = GetJwtToken(dto,role);


                    tokenDto.Token = token;
                    tokenDto.Message = "Login Successful Password rehashed";

                    return new Tuple<int, TokenDto>(2, tokenDto);
                }
                else
                {
                    if (verifiedpassword == PasswordVerificationResult.Failed)
                    {

                        tokenDto.Token = string.Empty;
                        tokenDto.Message = "The Password is incorrect";
                        
                        return new Tuple<int, TokenDto>(0, tokenDto);

                    }
                }

                tokenDto.Token = string.Empty;
                tokenDto.Message = "The Password is incorrect";
                
                return new Tuple<int, TokenDto>(0, tokenDto);
               
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
           
        }

        private string GetJwtToken(UserDto userDto,string role)
        {
           
                var claims = new List<Claim>
            {
                
               
                new Claim(ClaimTypes.NameIdentifier, userDto.Id.ToString()),
                new Claim(ClaimTypes.Name,userDto.Name),
                new Claim(ClaimTypes.Role,role),

            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Rv2wrjGu04Q1dvZOxpkFlEGCUJ2ztigMDEuVgoWVRw2"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "tayyab-client",
                audience: "backend-api",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);

        }

        public async Task<Tuple<int, string>> RegisterUser(UserDto userDto)
        {
            try
            {
                var existingUser = await _context.AccountUser.FirstOrDefaultAsync(u => u.Email == userDto.Email);
                if(existingUser != null)
                {
                    return new Tuple<int, string>(1, "The user is already existed");
                }

                _context.AccountUser.Add(new Entities.User
                {
                    Id = Guid.NewGuid(),
                    Name = userDto.Name,
                    Email = userDto.Email,
                    Password = Passwordhashing(userDto),

                });

                await _context.SaveChangesAsync();
              
                return new Tuple<int, string>(2, "User Successfully register");
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        private string Passwordhashing(UserDto dto)
        {
            var passwordHasher = new PasswordHasher<string>();
           return  passwordHasher.HashPassword(dto.Email, dto.Password);

        }

    }

    
}
