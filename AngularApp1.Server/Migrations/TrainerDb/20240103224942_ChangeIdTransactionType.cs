using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations.TrainerDb
{
    /// <inheritdoc />
    public partial class ChangeIdTransactionType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Zmień typ kolumny 'IdTransaction' na 'string' w tabeli 'Transaction'
            migrationBuilder.AlterColumn<string>(
                name: "IdTransaction",
                table: "Transaction",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            // Zmień typ kolumny 'IdTransaction' na 'string' w tabeli 'Training'
            migrationBuilder.AlterColumn<string>(
                name: "IdTransaction",
                table: "Training",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Zmień typ kolumny 'IdTransaction' z powrotem na 'decimal' w tabeli 'Transaction'
            migrationBuilder.AlterColumn<decimal>(
                name: "IdTransaction",
                table: "Transaction",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(string));

            // Zmień typ kolumny 'IdTransaction' z powrotem na 'decimal' w tabeli 'Training'
            migrationBuilder.AlterColumn<decimal>(
                name: "IdTransaction",
                table: "Training",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(string));
        }
    }
}
