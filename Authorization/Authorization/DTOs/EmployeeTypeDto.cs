using System.ComponentModel.DataAnnotations;

namespace Authorization.DTOs
{
    public class EmployeeTypeDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = null!;

        public string? Description { get; set; }
    }
}