using System.ComponentModel.DataAnnotations;

namespace Authorization.Entities
{
    public class Salary
    {

        [Key]
        public Guid Id { get; set; }

        public int EmployeeId { get; set; }

        public decimal BasicSalary { get; set; }

        public decimal Bonus { get; set; }

        public decimal Deduction { get; set; }

        public decimal NetSalary { get; set; }

        public DateTime PaymentDate { get; set; }

        public string Status { get; set; }
    }
}
