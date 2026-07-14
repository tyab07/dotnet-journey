using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IDepartmentService
    {
        Task<Tuple<List<DepartmentDto>, string>> GetAllDepartments();

        Task<Tuple<int, string>> AddDepartment(DepartmentDto departmentDto);

        Task<Tuple<int, string>> UpdateDepartment(DepartmentDto departmentDto);

        Task<Tuple<int, string>> DeleteDepartment(Guid id);
    }
}