using System.ComponentModel.DataAnnotations;

namespace Authorization.Entities
{
    public class EmployeeType
    {
        [Key]
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}