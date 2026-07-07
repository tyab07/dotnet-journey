namespace Authorization.DTOs
{
    public class EmployeeDto
    {
        public Guid Id { get; set; } 

        public string Name { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public DateOnly? Dob { set; get; }

        public string? Email { set; get; }

        public string? Position { get; set; }

        public string? Department { get; set; }
    }
}
