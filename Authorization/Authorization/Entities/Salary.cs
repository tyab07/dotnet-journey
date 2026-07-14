using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Authorization.Entities
{
    public class Salary
    {
        [Key]
        public Guid Id { get; set; }

        public Guid EmployeeId { get; set; }

        [ForeignKey(nameof(EmployeeId))]
        public Employee Employee { get; set; } = null!;

        public decimal BasicSalary { get; set; }

        public decimal Bonus { get; set; }

        public decimal Deduction { get; set; }

        public DateTime PaymentDate { get; set; }

        public string Status { get; set; } = null!;
    }
}