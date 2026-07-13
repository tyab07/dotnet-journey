using System.ComponentModel.DataAnnotations;

namespace Authorization.Entities
{
    public class Department
    {
        [Key]
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string HodName { get; set; }

        public string Description { get; set; }

        public string Location { get; set; }

    }
}
