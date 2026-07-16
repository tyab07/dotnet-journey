
using Authorization.Constants;
using Authorization.Data;
using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
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

        public async Task<Tuple<int, TokenDto>> loginUser(UserLoginDto userDto)
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
                        Password = existingUser.Password,
                        Role = existingUser.Role
                    };
                    
                    var token = GetJwtToken(dto);


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
                        Password = existingUser.Password,
                        Role = existingUser.Role
                    };
                  
                    var token = GetJwtToken(dto);


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
                throw ;
            }
           
        }

        private string GetJwtToken(UserDto userDto)
        {
           
                var claims = new List<Claim>
            {
                
               
                new Claim(ClaimTypes.NameIdentifier, userDto.Id.ToString()),
                new Claim(ClaimTypes.Name,userDto.Name),
                new Claim(ClaimTypes.Role,userDto.Role),
                new Claim(ClaimTypes.Email, userDto.Email),

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

                if (!Roles.AllRoles.Contains(userDto.Role))
                {
                    return new Tuple<int,string>(4,"Invalid role.");
                }
                var user = new UserLoginDto
                {
                    Email = userDto.Email,
                    Password = userDto.Password
                };

                _context.AccountUser.Add(new Entities.User
                {
                    Id = Guid.NewGuid(),
                    Name = userDto.Name,
                    Email = userDto.Email,
                    Password = Passwordhashing(user),
                    Role = userDto.Role

                });

                await _context.SaveChangesAsync();
              
                return new Tuple<int, string>(2, "User Successfully register");
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        private string Passwordhashing(UserLoginDto dto)
        {
            var passwordHasher = new PasswordHasher<string>();
           return  passwordHasher.HashPassword(dto.Email, dto.Password);

        }

        public async Task<Tuple<List<UserDto>, string>> GetAllUsers()
        {
            var users = await _context.AccountUser
                .AsNoTracking()
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Password = u.Password,
                    Role = u.Role
                })
                .ToListAsync();

            return new Tuple<List<UserDto>, string>(users, "Users retrieved successfully!");
        }

        public async Task<Tuple<UserDto, string>> GetUserById(Guid id)
        {
            var user = await _context.AccountUser
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return new Tuple<UserDto, string>(null, "User not found!");
            }

            var dto = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Password = user.Password,
                Role = user.Role
            };

            return new Tuple<UserDto, string>(dto, "User retrieved successfully!");
        }

        public async Task<Tuple<int, string>> UpdateUser(UserDto userDto)
        {
            try
            {
                var existingUser = await _context.AccountUser.FirstOrDefaultAsync(u => u.Id == userDto.Id);
                if (existingUser == null)
                {
                    return new Tuple<int, string>(0, "User not found!");
                }

                if (!Roles.AllRoles.Contains(userDto.Role))
                {
                    return new Tuple<int, string>(4, "Invalid role.");
                }

                if (existingUser.Email != userDto.Email)
                {
                    var emailExists = await _context.AccountUser.AnyAsync(u => u.Email == userDto.Email);
                    if (emailExists)
                    {
                        return new Tuple<int, string>(0, "Email is already taken by another user.");
                    }
                }

                existingUser.Name = userDto.Name;
                existingUser.Email = userDto.Email;
                existingUser.Role = userDto.Role;

                if (!string.IsNullOrEmpty(userDto.Password) && existingUser.Password != userDto.Password)
                {
                    var userLogin = new UserLoginDto { Email = userDto.Email, Password = userDto.Password };
                    existingUser.Password = Passwordhashing(userLogin);
                }

                await _context.SaveChangesAsync();
                return new Tuple<int, string>(1, "User updated successfully!");
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> DeleteUser(Guid id)
        {
            try
            {
                var existingUser = await _context.AccountUser.FirstOrDefaultAsync(u => u.Id == id);
                if (existingUser == null)
                {
                    return new Tuple<int, string>(0, "User not found!");
                }

                _context.AccountUser.Remove(existingUser);
                await _context.SaveChangesAsync();
                return new Tuple<int, string>(1, "User deleted successfully!");
            }
            catch (Exception)
            {
                throw;
            }
        }

    }

    
}
