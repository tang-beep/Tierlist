using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTierList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TierLists",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TierLists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TierRows",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    TierListId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TierRows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TierRows_TierLists_TierListId",
                        column: x => x.TierListId,
                        principalTable: "TierLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TierImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageItemId = table.Column<int>(type: "integer", nullable: false),
                    TierListId = table.Column<Guid>(type: "uuid", nullable: false),
                    TierRowId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TierImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TierImages_ImageItems_ImageItemId",
                        column: x => x.ImageItemId,
                        principalTable: "ImageItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TierImages_TierLists_TierListId",
                        column: x => x.TierListId,
                        principalTable: "TierLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TierImages_TierRows_TierRowId",
                        column: x => x.TierRowId,
                        principalTable: "TierRows",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TierImages_ImageItemId",
                table: "TierImages",
                column: "ImageItemId");

            migrationBuilder.CreateIndex(
                name: "IX_TierImages_TierListId",
                table: "TierImages",
                column: "TierListId");

            migrationBuilder.CreateIndex(
                name: "IX_TierImages_TierRowId",
                table: "TierImages",
                column: "TierRowId");

            migrationBuilder.CreateIndex(
                name: "IX_TierRows_TierListId",
                table: "TierRows",
                column: "TierListId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TierImages");

            migrationBuilder.DropTable(
                name: "TierRows");

            migrationBuilder.DropTable(
                name: "TierLists");
        }
    }
}
