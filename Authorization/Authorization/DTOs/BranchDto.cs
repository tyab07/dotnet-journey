using System.ComponentModel.DataAnnotations;

namespace Authorization.DTOs
{
    public class BranchDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string Address { get; set; } = null!;

        [Required]
        public string City { get; set; } = null!;

        public string? PhoneNumber { get; set; }
    }
}