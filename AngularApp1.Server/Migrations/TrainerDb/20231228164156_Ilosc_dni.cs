using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations.TrainerDb
{
    /// <inheritdoc />
    public partial class Ilosc_dni : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
           name: "Days",
           table: "Item",
           nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
