using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Authorization.Entities
{
    public class EmployeeDependent
    {
        [Key]
        public Guid Id { get; set; }

        public Guid EmployeeId { get; set; }

        [ForeignKey(nameof(EmployeeId))]
        public Employee Employee { get; set; }

        public string Name { get; set; }

        public string Relationship { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string PhoneNumber { get; set; }
    }
}