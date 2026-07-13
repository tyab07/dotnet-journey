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

        public DbSet<Department> Department { get; set; }

        public DbSet<Branch> Branches { get; set; }
        public DbSet<Designation> Designation { get; set; }
        public DbSet<Salary>Salary { get; set; }
        public DbSet<EmployeeDependent> EmployeeDependent { get; set; }
        public DbSet<EmployeeDocumentation> EmployeeDocumentation { get; set; }
        public DbSet<EmployeeType> EmployeType { set; get; }
    }
}
