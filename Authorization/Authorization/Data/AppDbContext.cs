using Authorization.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Authorization.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> option): base(option)
        {
             
        }


        public DbSet<User> AccountUser {  get; set; }
        public DbSet<Employee> Employee { get; set; }


    }
}
