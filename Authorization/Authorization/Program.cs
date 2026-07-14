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

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IEmployeeService, EmployeeService>();
            builder.Services.AddScoped<ISalaryService, SalaryService>();
            builder.Services.AddScoped<IBranchService, BranchService>();
            builder.Services.AddScoped<IDepartmentService, DepartmentService>();

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

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactPolicy", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials(); // only if using cookies
                });
            });
            

            builder.Services.AddControllers();
            var app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("ReactPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            Console.WriteLine("Application Started");
            app.Run();
        }
    }
}
