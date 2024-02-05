using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations.TrainerDb
{
    /// <inheritdoc />
    public partial class AddDateOfTransactionColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            Console.WriteLine("Executing Up method...");
            migrationBuilder.AddColumn<DateTimeOffset>(
            name: "DateOfTransaction",
            table: "Transaction",
            type: "datetimeoffset",
            nullable: false,
            defaultValueSql: "SYSDATETIMEOFFSET()"
        );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
            name: "DateOfTransaction",
            table: "Transaction"
         );
        }
    }
}
