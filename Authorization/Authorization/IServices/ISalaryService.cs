using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface ISalaryService
    {
        Task<Tuple<int,string,SalaryDto>> AddSalary(SalaryDto salary);
    }
}
