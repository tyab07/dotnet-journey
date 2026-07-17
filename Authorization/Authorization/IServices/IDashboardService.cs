using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetDashboard();
        Task<List<DashboardEmployeeDto>> GetEmployeesByDepartment(Guid departmentId);
        Task<List<DashboardEmployeeDto>> GetEmployeesByBranch(Guid branchId);
        Task<List<DashboardEmployeeDto>> GetEmployeesByDesignation(Guid designationId);
    }
}
