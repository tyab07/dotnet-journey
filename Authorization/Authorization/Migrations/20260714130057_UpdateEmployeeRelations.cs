using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Authorization.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEmployeeRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Department",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Employee");

            migrationBuilder.AddColumn<Guid>(
                name: "BranchId",
                table: "Employee",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DepartmentId",
                table: "Employee",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DesignationId",
                table: "Employee",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EmployeeTypeId",
                table: "Employee",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employee_BranchId",
                table: "Employee",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_DepartmentId",
                table: "Employee",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_DesignationId",
                table: "Employee",
                column: "DesignationId");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_EmployeeTypeId",
                table: "Employee",
                column: "EmployeeTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employee_Branches_BranchId",
                table: "Employee",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Employee_Department_DepartmentId",
                table: "Employee",
                column: "DepartmentId",
                principalTable: "Department",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Employee_Designation_DesignationId",
                table: "Employee",
                column: "DesignationId",
                principalTable: "Designation",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Employee_EmployeType_EmployeeTypeId",
                table: "Employee",
                column: "EmployeeTypeId",
                principalTable: "EmployeType",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employee_Branches_BranchId",
                table: "Employee");

            migrationBuilder.DropForeignKey(
                name: "FK_Employee_Department_DepartmentId",
                table: "Employee");

            migrationBuilder.DropForeignKey(
                name: "FK_Employee_Designation_DesignationId",
                table: "Employee");

            migrationBuilder.DropForeignKey(
                name: "FK_Employee_EmployeType_EmployeeTypeId",
                table: "Employee");

            migrationBuilder.DropIndex(
                name: "IX_Employee_BranchId",
                table: "Employee");

            migrationBuilder.DropIndex(
                name: "IX_Employee_DepartmentId",
                table: "Employee");

            migrationBuilder.DropIndex(
                name: "IX_Employee_DesignationId",
                table: "Employee");

            migrationBuilder.DropIndex(
                name: "IX_Employee_EmployeeTypeId",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "DesignationId",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "EmployeeTypeId",
                table: "Employee");

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "Employee",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Employee",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
