using Authorization.Data;
using Authorization.IServices;
using Authorization.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
namespace Authorization
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //var hasher = new PasswordHasher<string>();

            //var hash = hasher.HashPassword("admin@gmail.com", "Admin@123");
            //Console.WriteLine(hash);
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IEmployeeService, EmployeeService>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "tayyab-client",
                    ValidAudience = "backend-api",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Rv2wrjGu04Q1dvZOxpkFlEGCUJ2ztigMDEuVgoWVRw2"))
                };
            });
            builder.Services.AddControllers();
            var app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            
            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            Console.WriteLine("Application Started");
            app.Run();
        }
    }
}
