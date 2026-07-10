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
                    Department = x.Department,
                    Position = x.Position,
                    Email = x.Email
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
                    Department = employeeDto.Department,
                    Dob = employeeDto.Dob,
                    Email = employeeDto.Email,
                    LastModifiedDate = DateTime.UtcNow,
                    Position = employeeDto.Position
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
                existingUser.Department = employeeDto.Department ?? existingUser.Department;
                existingUser.Dob = employeeDto.Dob ?? existingUser.Dob;
                existingUser.Email = employeeDto.Email ?? existingUser.Email;
                existingUser.LastModifiedDate = DateTime.UtcNow;
                existingUser.Position = employeeDto.Position ?? existingUser.Position;
                
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
                    Department = x.Department,
                    Position = x.Position,
                    Email = x.Email
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
