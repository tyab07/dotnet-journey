using System.ComponentModel.DataAnnotations;

namespace Authorization.DTOs
{
    public class EmployeeDocumentationDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid EmployeeId { get; set; }

        [Required]
        public string DocumentName { get; set; } = null!;

        [Required]
        public string DocumentNumber { get; set; } = null!;

        public string? FilePath { get; set; }

        public DateTime? ExpiryDate { get; set; }
    }
}