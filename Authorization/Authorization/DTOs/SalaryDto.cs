using System.ComponentModel.DataAnnotations;

namespace Authorization.DTOs
{
    public class SalaryDto
    {
        public Guid Id { get; set; }

        public Guid EmployeeId { get; set; }

        public decimal BasicSalary { get; set; }

        public decimal Bonus { get; set; }

        public decimal Deduction { get; set; }

        public DateTime PaymentDate { get; set; }

        public string Status { get; set; } = null!;
    }
}