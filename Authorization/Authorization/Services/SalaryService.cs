using Authorization.Data;
using Authorization.DTOs;
using Authorization.IServices;

namespace Authorization.Services
{
    public class SalaryService(AppDbContext _context): ISalaryService
    {
        public async Task<Tuple<int,string,SalaryDto>> AddSalary(SalaryDto salary)
        {
            //var result = await _context.Salary.FirstOrDefaultAsync(s=> s.)
            return new Tuple<int,string,SalaryDto>(1,"Salary Added Successfully!", salary);
        }

        
    }
}
