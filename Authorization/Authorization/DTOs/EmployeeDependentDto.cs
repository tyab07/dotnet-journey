using System.ComponentModel.DataAnnotations;

namespace Authorization.DTOs
{
    public class EmployeeDependentDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid EmployeeId { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string Relationship { get; set; } = null!;

        [Required]
        public DateTime DateOfBirth { get; set; }

        public string? PhoneNumber { get; set; }
    }
}
