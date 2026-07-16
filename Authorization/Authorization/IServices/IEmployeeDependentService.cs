using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IEmployeeDependentService
    {
        Task<Tuple<List<EmployeeDependentDto>, string>> GetAllDependents();
        Task<Tuple<List<EmployeeDependentDto>, string>> GetDependentsByEmployeeId(Guid employeeId);
        Task<Tuple<int, string>> AddDependent(EmployeeDependentDto dependentDto);
        Task<Tuple<int, string>> UpdateDependent(EmployeeDependentDto dependentDto);
        Task<Tuple<int, string>> DeleteDependent(Guid id);
        Task<Tuple<EmployeeDependentDto, string>> GetDependentById(Guid id);
    }
}
