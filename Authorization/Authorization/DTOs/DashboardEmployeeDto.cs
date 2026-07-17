namespace Authorization.DTOs
{
    public class DashboardEmployeeDto
    {
        public Guid EmployeeId { get; set; }
        public string Name { get; set; }
        public string Designation { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string EmployeeType { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
