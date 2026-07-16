using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface ISalaryService
    {
        Task<Tuple<int, string>> AddSalary(SalaryDto salary);
        Task<Tuple<int, string>> UpdateSalary(SalaryDto salary);
        Task<Tuple<List<SalaryDto>, string>> GetAllSalaries();
        Task<Tuple<List<SalaryDto>, string>> GetSalariesByEmployeeEmail(string email);
        Task<Tuple<SalaryDto, string>> GetSalaryById(Guid id);
    }
}
