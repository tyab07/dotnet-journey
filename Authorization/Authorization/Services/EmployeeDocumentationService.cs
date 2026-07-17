using Authorization.Data;
using Authorization.DTOs;
using Authorization.Entities;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Services
{
    public class EmployeeDocumentationService(AppDbContext _context) : IEmployeeDocumentationService
    {
        public async Task<Tuple<List<EmployeeDocumentationDto>, string>> GetAllDocumentations()
        {
            var documentations = await _context.EmployeeDocumentation
                .AsNoTracking()
                .Select(d => new EmployeeDocumentationDto
                {
                    Id = d.Id,
                    EmployeeId = d.EmployeeId,
                    DocumentName = d.DocumentName,
                    DocumentNumber = d.DocumentNumber,
                    FilePath = d.FilePath,
                    ExpiryDate = d.ExpiryDate
                })
                .ToListAsync();

            return new Tuple<List<EmployeeDocumentationDto>, string>(
                documentations,
                "Data retrieved successfully!"
            );
        }

        public async Task<Tuple<List<EmployeeDocumentationDto>, string>> GetDocumentationsByEmployeeId(Guid employeeId)
        {
            var documentations = await _context.EmployeeDocumentation
                .AsNoTracking()
                .Where(d => d.EmployeeId == employeeId)
                .Select(d => new EmployeeDocumentationDto
                {
                    Id = d.Id,
                    EmployeeId = d.EmployeeId,
                    DocumentName = d.DocumentName,
                    DocumentNumber = d.DocumentNumber,
                    FilePath = d.FilePath,
                    ExpiryDate = d.ExpiryDate
                })
                .ToListAsync();

            return new Tuple<List<EmployeeDocumentationDto>, string>(
                documentations,
                "Data retrieved successfully!"
            );
        }

        public async Task<Tuple<int, string>> AddDocumentation(EmployeeDocumentationDto documentationDto)
        {
            try
            {
                var existing = await _context.EmployeeDocumentation
                    .FirstOrDefaultAsync(d => d.EmployeeId == documentationDto.EmployeeId
                        && d.DocumentNumber == documentationDto.DocumentNumber);

                if (existing != null)
                {
                    return new Tuple<int, string>(
                        0,
                        "A document with this number already exists for this employee!"
                    );
                }

                _context.EmployeeDocumentation.Add(new EmployeeDocumentation
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = documentationDto.EmployeeId,
                    DocumentName = documentationDto.DocumentName,
                    DocumentNumber = documentationDto.DocumentNumber,
                    FilePath = documentationDto.FilePath,
                    ExpiryDate = documentationDto.ExpiryDate
                });

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Documentation added successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> UpdateDocumentation(EmployeeDocumentationDto documentationDto)
        {
            try
            {
                var existing = await _context.EmployeeDocumentation
                    .FirstOrDefaultAsync(d => d.Id == documentationDto.Id);

                if (existing == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Documentation not found!"
                    );
                }

                existing.DocumentName = documentationDto.DocumentName;
                existing.DocumentNumber = documentationDto.DocumentNumber;
                existing.FilePath = documentationDto.FilePath;
                existing.ExpiryDate = documentationDto.ExpiryDate;

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Documentation updated successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> DeleteDocumentation(Guid id)
        {
            try
            {
                var existing = await _context.EmployeeDocumentation
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (existing == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Documentation not found!"
                    );
                }

                _context.EmployeeDocumentation.Remove(existing);
                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Documentation deleted successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<EmployeeDocumentationDto, string>> GetDocumentationById(Guid id)
        {
            try
            {
                var doc = await _context.EmployeeDocumentation
                    .AsNoTracking()
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (doc == null)
                {
                    return new Tuple<EmployeeDocumentationDto, string>(null, "Documentation not found!");
                }

                var dto = new EmployeeDocumentationDto
                {
                    Id = doc.Id,
                    EmployeeId = doc.EmployeeId,
                    DocumentName = doc.DocumentName,
                    DocumentNumber = doc.DocumentNumber,
                    FilePath = doc.FilePath,
                    ExpiryDate = doc.ExpiryDate
                };

                return new Tuple<EmployeeDocumentationDto, string>(dto, "Documentation retrieved successfully!");
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
