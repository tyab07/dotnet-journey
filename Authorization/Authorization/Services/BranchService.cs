using Authorization.Data;
using Authorization.DTOs;
using Authorization.Entities;
using Authorization.IServices;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Services
{
    public class BranchService(AppDbContext _context) : IBranchService
    {
        public async Task<Tuple<List<BranchDto>, string>> GetAllBranches()
        {
            var branches = await _context.Branches
                .AsNoTracking()
                .Select(b => new BranchDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Address = b.Address,
                    City = b.City,
                    PhoneNumber = b.PhoneNumber
                })
                .ToListAsync();

            return new Tuple<List<BranchDto>, string>(
                branches,
                "Data retrieved successfully!"
            );
        }

        public async Task<Tuple<int, string>> AddBranch(BranchDto branchDto)
        {
            try
            {
                var existingBranch = await _context.Branches
                    .FirstOrDefaultAsync(b => b.Name == branchDto.Name);

                if (existingBranch != null)
                {
                    return new Tuple<int, string>(
                        0,
                        "A branch with this name already exists!"
                    );
                }

                _context.Branches.Add(new Branch
                {
                    Name = branchDto.Name,
                    Address = branchDto.Address,
                    City = branchDto.City,
                    PhoneNumber = branchDto.PhoneNumber
                });

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Branch added successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> UpdateBranch(BranchDto branchDto)
        {
            try
            {
                var existingBranch = await _context.Branches
                    .FirstOrDefaultAsync(b => b.Id == branchDto.Id);

                if (existingBranch == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Branch not found!"
                    );
                }

                existingBranch.Name = branchDto.Name;
                existingBranch.Address = branchDto.Address;
                existingBranch.City = branchDto.City;
                existingBranch.PhoneNumber = branchDto.PhoneNumber;

                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Branch updated successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Tuple<int, string>> DeleteBranch(Guid id)
        {
            try
            {
                var existingBranch = await _context.Branches
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (existingBranch == null)
                {
                    return new Tuple<int, string>(
                        0,
                        "Branch not found!"
                    );
                }

                _context.Branches.Remove(existingBranch);
                await _context.SaveChangesAsync();

                return new Tuple<int, string>(
                    1,
                    "Branch deleted successfully!"
                );
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}