using Authorization.Data;
using Authorization.DTOs;
using Authorization.Entities;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Services
{
    public class EmployeeTypeService(AppDbContext _context) : IEmployeeTypeService
    {
        public async Task<Tuple<List<EmployeeTypeDto>, string>> GetAllEmployeeTypes()
        {
            var employeeTypes = await _context.EmployeType
                .AsNoTracking()
                .Select(e => new EmployeeTypeDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Description = e.Description
                })
                .ToListAsync();

            return new Tuple<List<EmployeeTypeDto>, string>(
                employeeTypes,
                "Data retrieved successfully!"
            );
        }

        public async Task<Tuple<int, string>> AddEmployeeType(EmployeeTypeDto employeeTypeDto)
        {
            try
            {
                var existing = await _context.EmployeType
                    .FirstOrDefaultAsync(e => e.Name == employeeTypeDto.Name);

                if (existing != null)
                {
                    return new Tuple<int, string>(
                        0,
                        "An employee type with this name already exists!"
                    );
                }

                _context.EmployeType.Add(new EmployeeType
                {
                    Id = Guid.NewGuid(),
                    Name = employeeTypeDto.Name,
                    Description = employeeTypeDto.Description
                });

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Employee type added successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> UpdateEmployeeType(EmployeeTypeDto employeeTypeDto)
        {
            try
            {
                var existing = await _context.EmployeType
                    .FirstOrDefaultAsync(e => e.Id == employeeTypeDto.Id);

                if (existing == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Employee type not found!"
                    );
                }

                existing.Name = employeeTypeDto.Name;
                existing.Description = employeeTypeDto.Description;

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Employee type updated successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> DeleteEmployeeType(Guid id)
        {
            try
            {
                var existing = await _context.EmployeType
                    .FirstOrDefaultAsync(e => e.Id == id);

                if (existing == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Employee type not found!"
                    );
                }

                _context.EmployeType.Remove(existing);
                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Employee type deleted successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
