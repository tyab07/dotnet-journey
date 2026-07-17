using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IEmployeeDocumentationService
    {
        Task<Tuple<List<EmployeeDocumentationDto>, string>> GetAllDocumentations();
        Task<Tuple<List<EmployeeDocumentationDto>, string>> GetDocumentationsByEmployeeId(Guid employeeId);
        Task<Tuple<int, string>> AddDocumentation(EmployeeDocumentationDto documentationDto);
        Task<Tuple<int, string>> UpdateDocumentation(EmployeeDocumentationDto documentationDto);
        Task<Tuple<int, string>> DeleteDocumentation(Guid id);
        Task<Tuple<EmployeeDocumentationDto, string>> GetDocumentationById(Guid id);
    }
}
