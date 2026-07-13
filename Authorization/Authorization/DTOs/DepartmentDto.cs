using System.ComponentModel.DataAnnotations;

namespace Authorization.DTOs
{
    public class DepartmentDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string HodName { get; set; } = null!;

        public string? Description { get; set; }

        public string? Location { get; set; }
    }
}