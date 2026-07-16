using Authorization.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Authorization.IServices
{
    public interface IDesignationService
    {
        Task<Tuple<List<DesignationDto>, string>> GetAllDesignations();
        Task<Tuple<int, string>> AddDesignation(DesignationDto designationDto);
        Task<Tuple<int, string>> UpdateDesignation(DesignationDto designationDto);
        Task<Tuple<int, string>> DeleteDesignation(Guid id);
        Task<Tuple<DesignationDto, string>> GetDesignationById(Guid id);
    }
}
