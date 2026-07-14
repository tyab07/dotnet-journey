using Authorization.Data;
using Authorization.DTOs;
using Authorization.Entities;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Services
{
    public class DepartmentService(AppDbContext _context) : IDepartmentService
    {
        public async Task<Tuple<List<DepartmentDto>, string>> GetAllDepartments()
        {
            var departments = await _context.Department
                .AsNoTracking()
                .Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    HodName = d.HodName,
                    Description = d.Description,
                    Location = d.Location
                })
                .ToListAsync();

            return new Tuple<List<DepartmentDto>, string>(
                departments,
                "Data retrieved successfully!"
            );
        }

        public async Task<Tuple<int, string>> AddDepartment(DepartmentDto departmentDto)
        {
            try
            {
                var existingDepartment = await _context.Department
                    .FirstOrDefaultAsync(d => d.Name == departmentDto.Name);

                if (existingDepartment != null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Department already exists!"
                    );
                }

                _context.Department.Add(new Department
                {
                    Name = departmentDto.Name,
                    HodName = departmentDto.HodName,
                    Description = departmentDto.Description,
                    Location = departmentDto.Location
                });

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Department added successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> UpdateDepartment(DepartmentDto departmentDto)
        {
            try
            {
                var existingDepartment = await _context.Department
                    .FirstOrDefaultAsync(d => d.Id == departmentDto.Id);

                if (existingDepartment == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Department not found!"
                    );
                }

                existingDepartment.Name = departmentDto.Name;
                existingDepartment.HodName = departmentDto.HodName;
                existingDepartment.Description = departmentDto.Description;
                existingDepartment.Location = departmentDto.Location;

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Department updated successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> DeleteDepartment(Guid id)
        {
            try
            {
                var existingDepartment = await _context.Department
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (existingDepartment == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Department not found!"
                    );
                }

                _context.Department.Remove(existingDepartment);
                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Department deleted successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}