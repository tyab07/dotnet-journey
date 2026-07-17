using Authorization.Data;
using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Services
{
    public class DashboardService(AppDbContext _context) : IDashboardService
    {
        public async Task<DashboardDto> GetDashboard()
        {
            var dashboard = new DashboardDto
            {
                TotalEmployees    = await _context.Employee.CountAsync(),
                TotalDepartments  = await _context.Department.CountAsync(),
                TotalBranches     = await _context.Branches.CountAsync(),
                TotalDesignations = await _context.Designation.CountAsync(),

                DepartmentDistribution = await _context.Employee
                    .Where(e => e.DepartmentId != null)
                    .GroupBy(e => new { e.DepartmentId, e.Department.Name })
                    .Select(g => new ChartItemDto { Id = g.Key.DepartmentId.ToString(), Label = g.Key.Name, Count = g.Count() })
                    .ToListAsync(),

                BranchDistribution = await _context.Employee
                    .Where(e => e.BranchId != null)
                    .GroupBy(e => new { e.BranchId, e.Branch.Name })
                    .Select(g => new ChartItemDto { Id = g.Key.BranchId.ToString(), Label = g.Key.Name, Count = g.Count() })
                    .ToListAsync(),

                DesignationDistribution = await _context.Employee
                    .Where(e => e.DesignationId != null)
                    .GroupBy(e => new { e.DesignationId, e.Designation.Name })
                    .Select(g => new ChartItemDto { Id = g.Key.DesignationId.ToString(), Label = g.Key.Name, Count = g.Count() })
                    .ToListAsync(),

                EmployeeTypeDistribution = await _context.Employee
                    .Where(e => e.EmployeeTypeId != null)
                    .GroupBy(e => new { e.EmployeeTypeId, e.EmployeeType.Name })
                    .Select(g => new ChartItemDto { Id = g.Key.EmployeeTypeId.ToString(), Label = g.Key.Name, Count = g.Count() })
                    .ToListAsync(),
            };

            return dashboard;
        }

        public async Task<List<DashboardEmployeeDto>> GetEmployeesByDepartment(Guid departmentId)
        {
            return await _context.Employee
                .Where(e => e.DepartmentId == departmentId)
                .Select(e => new DashboardEmployeeDto
                {
                    EmployeeId   = e.Id,
                    Name         = e.Name,
                    Designation  = e.Designation != null ? e.Designation.Name : null,
                    Branch       = e.Branch      != null ? e.Branch.Name      : null,
                    Department   = e.Department  != null ? e.Department.Name  : null,
                    EmployeeType = e.EmployeeType!= null ? e.EmployeeType.Name: null,
                    Email        = e.Email,
                    PhoneNumber  = null,
                })
                .ToListAsync();
        }

        public async Task<List<DashboardEmployeeDto>> GetEmployeesByBranch(Guid branchId)
        {
            return await _context.Employee
                .Where(e => e.BranchId == branchId)
                .Select(e => new DashboardEmployeeDto
                {
                    EmployeeId   = e.Id,
                    Name         = e.Name,
                    Designation  = e.Designation != null ? e.Designation.Name : null,
                    Branch       = e.Branch      != null ? e.Branch.Name      : null,
                    Department   = e.Department  != null ? e.Department.Name  : null,
                    EmployeeType = e.EmployeeType!= null ? e.EmployeeType.Name: null,
                    Email        = e.Email,
                    PhoneNumber  = null,
                })
                .ToListAsync();
        }

        public async Task<List<DashboardEmployeeDto>> GetEmployeesByDesignation(Guid designationId)
        {
            return await _context.Employee
                .Where(e => e.DesignationId == designationId)
                .Select(e => new DashboardEmployeeDto
                {
                    EmployeeId   = e.Id,
                    Name         = e.Name,
                    Designation  = e.Designation != null ? e.Designation.Name : null,
                    Branch       = e.Branch      != null ? e.Branch.Name      : null,
                    Department   = e.Department  != null ? e.Department.Name  : null,
                    EmployeeType = e.EmployeeType!= null ? e.EmployeeType.Name: null,
                    Email        = e.Email,
                    PhoneNumber  = null,
                })
                .ToListAsync();
        }
    }
}
