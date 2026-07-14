using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IEmployeeDocumentationService
    {
        Task<Tuple<List<EmployeeDocumentationDto>, string>> GetAllDocumentations();
        Task<Tuple<int, string>> AddDocumentation(EmployeeDocumentationDto documentationDto);
        Task<Tuple<int, string>> UpdateDocumentation(EmployeeDocumentationDto documentationDto);
        Task<Tuple<int, string>> DeleteDocumentation(Guid id);
    }
}
