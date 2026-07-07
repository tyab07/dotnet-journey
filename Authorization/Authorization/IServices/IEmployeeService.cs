using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IEmployeeService
    {
        Task<Tuple<int, List<EmployeeDto>>> GetAllEmployeesAsync();
        Task<Tuple<int, EmployeeDto, string>> RegisterEmployee(EmployeeDto employeeDto);
    }
}
