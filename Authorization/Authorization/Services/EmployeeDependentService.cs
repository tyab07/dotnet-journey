using Authorization.Data;
using Authorization.DTOs;
using Authorization.Entities;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Services
{
    public class EmployeeDependentService(AppDbContext _context) : IEmployeeDependentService
    {
        public async Task<Tuple<List<EmployeeDependentDto>, string>> GetAllDependents()
        {
            var dependents = await _context.EmployeeDependent
                .AsNoTracking()
                .Select(d => new EmployeeDependentDto
                {
                    Id = d.Id,
                    EmployeeId = d.EmployeeId,
                    Name = d.Name,
                    Relationship = d.Relationship,
                    DateOfBirth = d.DateOfBirth,
                    PhoneNumber = d.PhoneNumber
                })
                .ToListAsync();

            return new Tuple<List<EmployeeDependentDto>, string>(
                dependents,
                "Data retrieved successfully!"
            );
        }

        public async Task<Tuple<List<EmployeeDependentDto>, string>> GetDependentsByEmployeeId(Guid employeeId)
        {
            var dependents = await _context.EmployeeDependent
                .AsNoTracking()
                .Where(d => d.EmployeeId == employeeId)
                .Select(d => new EmployeeDependentDto
                {
                    Id = d.Id,
                    EmployeeId = d.EmployeeId,
                    Name = d.Name,
                    Relationship = d.Relationship,
                    DateOfBirth = d.DateOfBirth,
                    PhoneNumber = d.PhoneNumber
                })
                .ToListAsync();

            return new Tuple<List<EmployeeDependentDto>, string>(
                dependents,
                "Data retrieved successfully!"
            );
        }

        public async Task<Tuple<int, string>> AddDependent(EmployeeDependentDto dependentDto)
        {
            try
            {
                var existing = await _context.EmployeeDependent
                    .FirstOrDefaultAsync(d => d.EmployeeId == dependentDto.EmployeeId
                        && d.Name == dependentDto.Name
                        && d.Relationship == dependentDto.Relationship);

                if (existing != null)
                {
                    return new Tuple<int, string>(
                        0,
                        "This dependent already exists for the employee!"
                    );
                }

                _context.EmployeeDependent.Add(new EmployeeDependent
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = dependentDto.EmployeeId,
                    Name = dependentDto.Name,
                    Relationship = dependentDto.Relationship,
                    DateOfBirth = dependentDto.DateOfBirth,
                    PhoneNumber = dependentDto.PhoneNumber
                });

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Dependent added successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> UpdateDependent(EmployeeDependentDto dependentDto)
        {
            try
            {
                var existing = await _context.EmployeeDependent
                    .FirstOrDefaultAsync(d => d.Id == dependentDto.Id);

                if (existing == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Dependent not found!"
                    );
                }

                existing.Name = dependentDto.Name;
                existing.Relationship = dependentDto.Relationship;
                existing.DateOfBirth = dependentDto.DateOfBirth;
                existing.PhoneNumber = dependentDto.PhoneNumber;

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Dependent updated successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> DeleteDependent(Guid id)
        {
            try
            {
                var existing = await _context.EmployeeDependent
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (existing == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Dependent not found!"
                    );
                }

                _context.EmployeeDependent.Remove(existing);
                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Dependent deleted successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
