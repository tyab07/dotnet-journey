using Authorization.Data;
using Authorization.DTOs;
using Authorization.Entities;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Services
{
    public class DesignationService(AppDbContext _context) : IDesignationService
    {
        public async Task<Tuple<List<DesignationDto>, string>> GetAllDesignations()
        {
            var designations = await _context.Designation
                .AsNoTracking()
                .Select(d => new DesignationDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description
                })
                .ToListAsync();

            return new Tuple<List<DesignationDto>, string>(
                designations,
                "Data retrieved successfully!"
            );
        }

        public async Task<Tuple<int, string>> AddDesignation(DesignationDto designationDto)
        {
            try
            {
                var existing = await _context.Designation
                    .FirstOrDefaultAsync(d => d.Name == designationDto.Name);

                if (existing != null)
                {
                    return new Tuple<int, string>(
                        0,
                        "A designation with this name already exists!"
                    );
                }

                _context.Designation.Add(new Designation
                {
                    Id = Guid.NewGuid(),
                    Name = designationDto.Name,
                    Description = designationDto.Description
                });

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Designation added successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> UpdateDesignation(DesignationDto designationDto)
        {
            try
            {
                var existing = await _context.Designation
                    .FirstOrDefaultAsync(d => d.Id == designationDto.Id);

                if (existing == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Designation not found!"
                    );
                }

                existing.Name = designationDto.Name;
                existing.Description = designationDto.Description;

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Designation updated successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> DeleteDesignation(Guid id)
        {
            try
            {
                var existing = await _context.Designation
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (existing == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Designation not found!"
                    );
                }

                _context.Designation.Remove(existing);
                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Designation deleted successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
