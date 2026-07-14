using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IEmployeeTypeService
    {
        Task<Tuple<List<EmployeeTypeDto>, string>> GetAllEmployeeTypes();
        Task<Tuple<int, string>> AddEmployeeType(EmployeeTypeDto employeeTypeDto);
        Task<Tuple<int, string>> UpdateEmployeeType(EmployeeTypeDto employeeTypeDto);
        Task<Tuple<int, string>> DeleteEmployeeType(Guid id);
    }
}
