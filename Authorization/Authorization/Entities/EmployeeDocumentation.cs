using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Authorization.Entities
{
    public class EmployeeDocumentation
    {
        [Key]
        public Guid Id { get; set; }

        public Guid EmployeeId { get; set; }

        [ForeignKey(nameof(EmployeeId))]
        public Employee Employee { get; set; }

        public string DocumentName { get; set; }

        public string DocumentNumber { get; set; }

        public string FilePath { get; set; }

        public DateTime? ExpiryDate { get; set; }
    }
}