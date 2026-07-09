namespace Authorization.Constants
{
    public static class Roles
    {
        public const string SuperAdmin = "SuperAdmin";
        public const string Admin = "Admin";
        public const string Employee = "Employee";

        public static readonly HashSet<string> AllRoles = new()
    {
        SuperAdmin,
        Admin,
        Employee
    };
    }
}
