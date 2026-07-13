using System.ComponentModel.DataAnnotations;

namespace Authorization.DTOs
{
    public class SalaryDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid EmployeeId { get; set; }

        [Required]
        public decimal BasicSalary { get; set; }

        public decimal Bonus { get; set; }

        public decimal Deduction { get; set; }

        public decimal NetSalary { get; set; }

        [Required]
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
        public int Month { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        [Required]
        public string Status { get; set; } = null!;
    }
}