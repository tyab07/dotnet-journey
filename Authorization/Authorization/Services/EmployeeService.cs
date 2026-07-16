using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;
using Authorization.Data;

namespace Authorization.Services
{
    public class EmployeeService(AppDbContext _context) : IEmployeeService
    {

        public async Task<Tuple<int, List<EmployeeDto>>> GetAllEmployeesAsync()
        {
            try
            {
                return new Tuple<int, List<EmployeeDto>>(1, await _context.Employee.AsNoTracking().Select(x => new EmployeeDto
                {
                    Id = x.Id,
                    CreatedDate = x.CreatedDate,
                    LastModifiedDate = x.LastModifiedDate,
                    Name = x.Name,
                    Dob = x.Dob,
                    Email = x.Email,
                    DepartmentId = x.DepartmentId,
                    DesignationId = x.DesignationId,
                    BranchId = x.BranchId,
                    EmployeeTypeId = x.EmployeeTypeId,
                    DepartmentName = x.Department != null ? x.Department.Name : null,
                    DesignationName = x.Designation != null ? x.Designation.Name : null,
                    BranchName = x.Branch != null ? x.Branch.Name : null,
                    EmployeeTypeName = x.EmployeeType != null ? x.EmployeeType.Name : null
                }).ToListAsync());
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        
        public async Task<Tuple<int, List<EmployeeDto>>> GetEmployeeByEmailAsync(string email)
        {
            try
            {
                return new Tuple<int, List<EmployeeDto>>(1, await _context.Employee.AsNoTracking().Where(x => x.Email == email).Select(x => new EmployeeDto
                {
                    Id = x.Id,
                    CreatedDate = x.CreatedDate,
                    LastModifiedDate = x.LastModifiedDate,
                    Name = x.Name,
                    Dob = x.Dob,
                    Email = x.Email,
                    DepartmentId = x.DepartmentId,
                    DesignationId = x.DesignationId,
                    BranchId = x.BranchId,
                    EmployeeTypeId = x.EmployeeTypeId,
                    DepartmentName = x.Department != null ? x.Department.Name : null,
                    DesignationName = x.Designation != null ? x.Designation.Name : null,
                    BranchName = x.Branch != null ? x.Branch.Name : null,
                    EmployeeTypeName = x.EmployeeType != null ? x.EmployeeType.Name : null
                }).ToListAsync());
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public async Task<Tuple<int,EmployeeDto,string>> RegisterEmployee(EmployeeDto employeeDto)
        {
            try
            {
                var existingUser = await _context.Employee.FirstOrDefaultAsync(x => x.Email == employeeDto.Email);

                if (existingUser != null)
                {
                    return  new Tuple<int, EmployeeDto, string>(1, null, $"The User{existingUser.Name} is already existing ");
                }

                _context.Employee.Add(new Entities.Employee
                {
                    Name = employeeDto.Name,
                    CreatedDate = DateTime.UtcNow,
                    Dob = employeeDto.Dob,
                    Email = employeeDto.Email,
                    LastModifiedDate = DateTime.UtcNow,
                    DepartmentId = employeeDto.DepartmentId,
                    DesignationId = employeeDto.DesignationId,
                    BranchId = employeeDto.BranchId,
                    EmployeeTypeId = employeeDto.EmployeeTypeId
                }
                );

                await _context.SaveChangesAsync();
                return new Tuple<int, EmployeeDto, string>(1, employeeDto, "User Successfully register");
            }
            catch (Exception ex)
            {
                throw;
            }


        }



        public async Task<Tuple<int, EmployeeDto, string>> UpdateEmployee(EmployeeDto employeeDto)
        {
            try
            {
                var existingUser = await _context.Employee.FirstOrDefaultAsync(x => x.Email == employeeDto.Email);

                if (existingUser == null)
                {
                    return new Tuple<int, EmployeeDto, string>(0, null, "The User does not exist ");
                }

                existingUser.Name = employeeDto.Name ?? existingUser.Name;
                existingUser.CreatedDate = existingUser.CreatedDate;
                existingUser.Dob = employeeDto.Dob ?? existingUser.Dob;
                existingUser.Email = employeeDto.Email ?? existingUser.Email;
                existingUser.LastModifiedDate = DateTime.UtcNow;
                existingUser.DepartmentId = employeeDto.DepartmentId ?? existingUser.DepartmentId;
                existingUser.DesignationId = employeeDto.DesignationId ?? existingUser.DesignationId;
                existingUser.BranchId = employeeDto.BranchId ?? existingUser.BranchId;
                existingUser.EmployeeTypeId = employeeDto.EmployeeTypeId ?? existingUser.EmployeeTypeId;
                
                await _context.SaveChangesAsync();
                return new Tuple<int, EmployeeDto, string>(1, employeeDto, "User Successfully Updated");
            }
            catch (Exception ex)
            {
                throw;
            }


        }

        public async Task<Tuple<int,string>> DeleteEmployee(EmployeeDto employeeDto)
        {
            try
            {
                var existingUser = await _context.Employee.FirstOrDefaultAsync(x => x.Email == employeeDto.Email);
                if (existingUser == null)
                {
                    return new Tuple<int, string>(0, "The User does not exist ");
                }
                _context.Employee.Remove(existingUser);
                await _context.SaveChangesAsync();
                return new Tuple<int, string>(1, "User Successfully Deleted");
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Tuple<int, EmployeeDto>> GetEmployeeById(Guid id)
        {
            try
            {
                var employee =  await _context.Employee.AsNoTracking().Select(x => new EmployeeDto
                {
                    Id = x.Id,
                    CreatedDate = x.CreatedDate,
                    LastModifiedDate = x.LastModifiedDate,
                    Name = x.Name,
                    Dob = x.Dob,
                    Email = x.Email,
                    DepartmentId = x.DepartmentId,
                    DesignationId = x.DesignationId,
                    BranchId = x.BranchId,
                    EmployeeTypeId = x.EmployeeTypeId,
                    DepartmentName = x.Department != null ? x.Department.Name : null,
                    DesignationName = x.Designation != null ? x.Designation.Name : null,
                    BranchName = x.Branch != null ? x.Branch.Name : null,
                    EmployeeTypeName = x.EmployeeType != null ? x.EmployeeType.Name : null
                }).FirstOrDefaultAsync(x=>x.Id == id);

                if(employee == null)
                {
                    return new Tuple<int, EmployeeDto>(0, null);
                }

                return new Tuple<int, EmployeeDto>(1, employee);
            }
            catch (Exception ex)
            {
                throw;
            }

        }




    }
}
