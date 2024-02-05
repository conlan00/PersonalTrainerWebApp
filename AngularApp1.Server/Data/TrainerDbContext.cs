using System;
using System.Collections.Generic;
using backend.ModelsTrainer;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public partial class TrainerDbContext : DbContext
{
    public TrainerDbContext()
    {
    }

    public TrainerDbContext(DbContextOptions<TrainerDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Exercise> Exercises { get; set; }

    public virtual DbSet<Item> Items { get; set; }

    public virtual DbSet<Training> Training { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<User> Users { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.IdExercise).HasName("Exercise_PK");

            entity.ToTable("Exercise");

            entity.Property(e => e.IdExercise)
                .HasColumnType("numeric(28, 0)")
                .HasColumnName("idExercise");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.IdItem).HasName("Item_PK");

            entity.ToTable("Item");

            entity.Property(e => e.IdItem)
                .HasColumnType("numeric(28, 0)")
                .HasColumnName("idItem");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("numeric(28, 0)")
                .HasColumnName("price");
        });

        modelBuilder.Entity<Training>(entity =>
        {
            entity.HasKey(e => new { e.IdTraining, e.IdExercise, e.IdTransaction }).HasName("Training_PK");

            entity.Property(e => e.IdTraining)
                .HasColumnType("numeric(28, 0)")
                .HasColumnName("idTraining");
            entity.Property(e => e.IdExercise)
                .HasColumnType("numeric(28, 0)")
                .HasColumnName("idExercise");
            entity.Property(e => e.IdTransaction)
                .HasColumnType("numeric(28, 0)")
                .HasColumnName("idTransaction");
            entity.Property(e => e.DayOfWeek).HasColumnName("dayOfWeek");

            entity.HasOne(d => d.IdExerciseNavigation).WithMany(p => p.Training)
                .HasForeignKey(d => d.IdExercise)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Exercise_FK");

            entity.HasOne(d => d.IdTransactionNavigation).WithMany(p => p.Training)
                .HasForeignKey(d => d.IdTransaction)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Transaction_FK");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.IdTransaction).HasName("Transaction_PK");

            entity.ToTable("Transaction");

            entity.Property(e => e.IdTransaction)
                .HasColumnType("numeric(28, 0)")
                .HasColumnName("idTransaction");
            entity.Property(e => e.EmailUser)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("emailUser");
            entity.Property(e => e.IdItem)
                .HasColumnType("numeric(28, 0)")
                .HasColumnName("idItem");
            entity.Property(e => e.IsPaid).HasColumnName("isPaid");

            entity.HasOne(d => d.EmailUserNavigation).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.EmailUser)
                .HasConstraintName("User_FK");

            entity.HasOne(d => d.IdItemNavigation).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.IdItem)
                .HasConstraintName("Item_FK");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Email).HasName("User_PK");

            entity.ToTable("User");

            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Surname)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("surname");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
