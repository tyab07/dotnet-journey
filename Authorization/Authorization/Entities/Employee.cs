using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Authorization.Entities
{
    public class Employee
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = null!;

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public DateOnly? Dob { get; set; }

        public string? Email { get; set; }

        // ── Foreign Keys ──────────────────────────────────────────

        public Guid? DepartmentId { get; set; }
        [ForeignKey(nameof(DepartmentId))]
        public Department? Department { get; set; }

        public Guid? DesignationId { get; set; }
        [ForeignKey(nameof(DesignationId))]
        public Designation? Designation { get; set; }

        public Guid? BranchId { get; set; }
        [ForeignKey(nameof(BranchId))]
        public Branch? Branch { get; set; }

        public Guid? EmployeeTypeId { get; set; }
        [ForeignKey(nameof(EmployeeTypeId))]
        public EmployeeType? EmployeeType { get; set; }

        // ── Navigation Collections ────────────────────────────────
        public ICollection<Salary>? Salaries { get; set; }
        public ICollection<EmployeeDependent>? Dependents { get; set; }
        public ICollection<EmployeeDocumentation>? Documentations { get; set; }
    }
}
