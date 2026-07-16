using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IEmployeeService
    {
        Task<Tuple<int, List<EmployeeDto>>> GetAllEmployeesAsync();
        Task<Tuple<int, List<EmployeeDto>>> GetEmployeeByEmailAsync(string email);
        Task<Tuple<int, EmployeeDto, string>> RegisterEmployee(EmployeeDto employeeDto);
        Task<Tuple<int, EmployeeDto, string>> UpdateEmployee(EmployeeDto employeeDto);
        Task<Tuple<int, EmployeeDto>> GetEmployeeById(Guid id);
        Task<Tuple<int, string>> DeleteEmployee(EmployeeDto employeeDto);
    }
}
