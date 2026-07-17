namespace Authorization.DTOs
{
    public class DashboardDto
    {
        public int TotalEmployees { get; set; }

        public int TotalDepartments { get; set; }

        public int TotalBranches { get; set; }

        public int TotalDesignations { get; set; }

        public List<ChartItemDto> DepartmentDistribution { get; set; }

        public List<ChartItemDto> BranchDistribution { get; set; }

        public List<ChartItemDto> DesignationDistribution { get; set; }

        public List<ChartItemDto> EmployeeTypeDistribution { get; set; }
    }
}
