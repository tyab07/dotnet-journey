using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface ISalaryService
    {
        Tuple<int, string, SalaryDto> AddSalary(SalaryDto salary);
    }
}
