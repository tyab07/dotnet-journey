using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface ISalaryService
    {
        Task<Tuple<int, string>> AddSalary(SalaryDto salary);
        Task<Tuple<int, string>> UpdateSalary(SalaryDto salary);
        Task<Tuple<List<SalaryDto>, string>> GetAllSalaries();
    }
}
