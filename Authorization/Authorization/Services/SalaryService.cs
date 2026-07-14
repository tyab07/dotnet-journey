using Authorization.Data;
using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Services
{
    public class SalaryService(AppDbContext _context): ISalaryService
    {


        public async Task<Tuple<List<SalaryDto>,string>> GetAllSalaries()
        {
            var salaries = await _context.Salary.AsNoTracking().Select(x => new SalaryDto
            {
                Id = x.Id,
                EmployeeId = x.EmployeeId,
                BasicSalary = x.BasicSalary,
                Bonus = x.Bonus,
                Deduction = x.Deduction,
                PaymentDate = x.PaymentDate,
                Status = x.Status


            }).ToListAsync();

            return new Tuple<List<SalaryDto>, string> (salaries, "Data retrieved successfully!");
        }
        public async Task<Tuple<int,string>> AddSalary(SalaryDto salary)
        {
            try
            {
                var ExistingSalary = await _context.Salary.FirstOrDefaultAsync(s => s.EmployeeId == salary.EmployeeId && s.PaymentDate.Month == salary.PaymentDate.Month &&
                s.PaymentDate.Year == salary.PaymentDate.Year);
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

        public async Task<Tuple<int, string>> UpdateSalary(SalaryDto salaryDto)
        {

            try
            {
                var ExistingSalary = await _context.Salary.FirstOrDefaultAsync(s => s.Id == salaryDto.Id && s.EmployeeId == salaryDto.EmployeeId);

                ExistingSalary.Deduction = salaryDto.Deduction;
                ExistingSalary.Status = salaryDto.Status ?? ExistingSalary.Status;
                ExistingSalary.BasicSalary = salaryDto.BasicSalary;
                ExistingSalary.Bonus = salaryDto.Bonus;
                ExistingSalary.PaymentDate = salaryDto.PaymentDate;

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(1, "Salary Updated SuccessFully!");
            }
            catch (Exception ex)
            {
                throw;
            }
           



        }



    }
}
