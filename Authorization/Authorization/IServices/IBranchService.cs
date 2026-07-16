using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IBranchService
    {
        Task<Tuple<List<BranchDto>, string>> GetAllBranches();

        Task<Tuple<int, string>> AddBranch(BranchDto branchDto);

        Task<Tuple<int, string>> UpdateBranch(BranchDto branchDto);

        Task<Tuple<int, string>> DeleteBranch(Guid id);

        Task<Tuple<BranchDto, string>> GetBranchById(Guid id);
    }
}