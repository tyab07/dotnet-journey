
using Authorization.Data;
using Authorization.IServices;
using Authorization.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
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

        public async Task<Tuple<int,string>> loginUser(UserDto userDto)
        {
            try
            {
                if(userDto == null)
                {
                    return new Tuple<int, string>(1, "Fill all the entities");

                }
                var existingUser = await _context.AccountUser.FirstOrDefaultAsync(u => u.Email == userDto.Email);

                if (existingUser == null)
                {
                    return new Tuple<int,string>(0, "The User is not registered.Please Register the User");
                }
                
                var hashedPassword = new PasswordHasher<string>();
                var verifiedpassword = hashedPassword.VerifyHashedPassword(userDto.Email, existingUser.Password, userDto.Password);

                if(verifiedpassword == PasswordVerificationResult.Success)
                {
                    return new Tuple<int, string>(2, "Login Successful");
                }
                else if (verifiedpassword == PasswordVerificationResult.SuccessRehashNeeded)
                {
                    existingUser.Password = Passwordhashing(userDto);
                    _context.AccountUser.Update(existingUser);
                    await _context.SaveChangesAsync();
                    return new Tuple<int, string>(2, "Login Successful");
                }
                else
                    if (verifiedpassword == PasswordVerificationResult.Failed)
                {
                    return new Tuple<int, string>(1, "The Password is incorrect");
                }

                return new Tuple<int, string>(1, "The Password is incorrect");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
           
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
