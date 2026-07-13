using System.ComponentModel.DataAnnotations;

namespace Authorization.Entities
{
    public class Branch
    {
        [Key]
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string PhoneNumber { get; set; }
    }
}