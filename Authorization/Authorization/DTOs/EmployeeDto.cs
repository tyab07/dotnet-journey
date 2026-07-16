namespace Authorization.DTOs
{
    public class EmployeeDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public DateOnly? Dob { get; set; }

        public string? Email { get; set; }

        // ── Foreign Key IDs ───────────────────────────────────────
        public Guid? DepartmentId { get; set; }
        public Guid? DesignationId { get; set; }
        public Guid? BranchId { get; set; }
        public Guid? EmployeeTypeId { get; set; }

        // ── Resolved Names (read-only, for display) ───────────────
        public string? DepartmentName { get; set; }
        public string? DesignationName { get; set; }
        public string? BranchName { get; set; }
        public string? EmployeeTypeName { get; set; }
    }
}
