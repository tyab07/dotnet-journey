using Authorization.Data;
using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Services
{
    public class SalaryService(AppDbContext _context): ISalaryService
    {
        public async Task<Tuple<int,string>> AddSalary(SalaryDto salary)
        {
            try
            {
                var ExistingSalary = await _context.Salary.FirstOrDefaultAsync(s => s.Month == salary.Month && s.Year == salary.Year);
                if (ExistingSalary != null)
                {
                    return new Tuple<int, string>(0, "The Salary for the current month is already stored You cant make new " +
                        "data entry .Try to update it!");
                }
                _context.Salary.Add(new Entities.Salary
                {
                    EmployeeId = salary.EmployeeId,
                    BasicSalary = salary.BasicSalary,
                    Bonus = salary.Bonus,
                    Deduction = salary.Deduction,
                    Month = salary.Month,
                    Year = salary.Year,
                    PaymentDate = salary.PaymentDate,
                    Status = salary.Status,


                });
                await _context.SaveChangesAsync();
                return new Tuple<int, string>(1, "Salary Added Successfully!");
            }
            catch (Exception ex) {
                throw;
            }
           
        }

        
    }
}
