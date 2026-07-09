using System.ComponentModel.DataAnnotations;

namespace Authorization.Entities
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        public string? Name { get;set; }
        [Required]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;

        public string Role { get; set; } = null;
    }
}
