using Microsoft.EntityFrameworkCore;
using Authorization.Data;
using Authorization.Services;
using Authorization.IServices;
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
            builder.Services.AddControllers();
            var app = builder.Build();
            app.UseAuthorization();
            app.UseHttpsRedirection();
            app.MapControllers();
            app.Run();

        }
    }
}
