using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Authorization.Migrations
{
    /// <inheritdoc />
    public partial class SalaryUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NetSalary",
                table: "Salary");

            migrationBuilder.AddColumn<int>(
                name: "Month",
                table: "Salary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "Salary",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Month",
                table: "Salary");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "Salary");

            migrationBuilder.AddColumn<decimal>(
                name: "NetSalary",
                table: "Salary",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
