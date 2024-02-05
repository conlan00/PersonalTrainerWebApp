﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backend.Data;

#nullable disable

namespace backend.Migrations.TrainerDb
{
    [DbContext(typeof(TrainerDbContext))]
    [Migration("20231228164156_Ilosc_dni")]
    partial class Ilosc_dni
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("backend.ModelsTrainer.Exercise", b =>
                {
                    b.Property<decimal>("IdExercise")
                        .HasColumnType("numeric(28, 0)")
                        .HasColumnName("idExercise");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("name");

                    b.HasKey("IdExercise")
                        .HasName("Exercise_PK");

                    b.ToTable("Exercise", (string)null);
                });

            modelBuilder.Entity("backend.ModelsTrainer.Item", b =>
                {
                    b.Property<decimal>("IdItem")
                        .HasColumnType("numeric(28, 0)")
                        .HasColumnName("idItem");

                    b.Property<int>("Days")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("name");

                    b.Property<decimal>("Price")
                        .HasColumnType("numeric(28, 0)")
                        .HasColumnName("price");

                    b.HasKey("IdItem")
                        .HasName("Item_PK");

                    b.ToTable("Item", (string)null);
                });

            modelBuilder.Entity("backend.ModelsTrainer.Training", b =>
                {
                    b.Property<decimal>("IdTraining")
                        .HasColumnType("numeric(28, 0)")
                        .HasColumnName("idTraining");

                    b.Property<decimal>("IdExercise")
                        .HasColumnType("numeric(28, 0)")
                        .HasColumnName("idExercise");

                    b.Property<decimal>("IdTransaction")
                        .HasColumnType("numeric(28, 0)")
                        .HasColumnName("idTransaction");

                    b.Property<byte>("DayOfWeek")
                        .HasColumnType("tinyint")
                        .HasColumnName("dayOfWeek");

                    b.HasKey("IdTraining", "IdExercise", "IdTransaction")
                        .HasName("Training_PK");

                    b.HasIndex("IdExercise");

                    b.HasIndex("IdTransaction");

                    b.ToTable("Training");
                });

            modelBuilder.Entity("backend.ModelsTrainer.Transaction", b =>
                {
                    b.Property<decimal>("IdTransaction")
                        .HasColumnType("numeric(28, 0)")
                        .HasColumnName("idTransaction");

                    b.Property<string>("EmailUser")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("emailUser");

                    b.Property<decimal?>("IdItem")
                        .HasColumnType("numeric(28, 0)")
                        .HasColumnName("idItem");

                    b.Property<bool>("IsPaid")
                        .HasColumnType("bit")
                        .HasColumnName("isPaid");

                    b.HasKey("IdTransaction")
                        .HasName("Transaction_PK");

                    b.HasIndex("EmailUser");

                    b.HasIndex("IdItem");

                    b.ToTable("Transaction", (string)null);
                });

            modelBuilder.Entity("backend.ModelsTrainer.User", b =>
                {
                    b.Property<string>("Email")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("email");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("name");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("surname");

                    b.HasKey("Email")
                        .HasName("User_PK");

                    b.ToTable("User", (string)null);
                });

            modelBuilder.Entity("backend.ModelsTrainer.Training", b =>
                {
                    b.HasOne("backend.ModelsTrainer.Exercise", "IdExerciseNavigation")
                        .WithMany("Training")
                        .HasForeignKey("IdExercise")
                        .IsRequired()
                        .HasConstraintName("Exercise_FK");

                    b.HasOne("backend.ModelsTrainer.Transaction", "IdTransactionNavigation")
                        .WithMany("Training")
                        .HasForeignKey("IdTransaction")
                        .IsRequired()
                        .HasConstraintName("Transaction_FK");

                    b.Navigation("IdExerciseNavigation");

                    b.Navigation("IdTransactionNavigation");
                });

            modelBuilder.Entity("backend.ModelsTrainer.Transaction", b =>
                {
                    b.HasOne("backend.ModelsTrainer.User", "EmailUserNavigation")
                        .WithMany("Transactions")
                        .HasForeignKey("EmailUser")
                        .HasConstraintName("User_FK");

                    b.HasOne("backend.ModelsTrainer.Item", "IdItemNavigation")
                        .WithMany("Transactions")
                        .HasForeignKey("IdItem")
                        .HasConstraintName("Item_FK");

                    b.Navigation("EmailUserNavigation");

                    b.Navigation("IdItemNavigation");
                });

            modelBuilder.Entity("backend.ModelsTrainer.Exercise", b =>
                {
                    b.Navigation("Training");
                });

            modelBuilder.Entity("backend.ModelsTrainer.Item", b =>
                {
                    b.Navigation("Transactions");
                });

            modelBuilder.Entity("backend.ModelsTrainer.Transaction", b =>
                {
                    b.Navigation("Training");
                });

            modelBuilder.Entity("backend.ModelsTrainer.User", b =>
                {
                    b.Navigation("Transactions");
                });
#pragma warning restore 612, 618
        }
    }
}
