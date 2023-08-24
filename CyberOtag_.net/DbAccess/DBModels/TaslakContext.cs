using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DbAccess.DBModels;

public partial class TaslakContext : DbContext
{
    public TaslakContext()
    {
    }

    public TaslakContext(DbContextOptions<TaslakContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Assignment> Assignments { get; set; }

    public virtual DbSet<Branch> Branches { get; set; }

    public virtual DbSet<Channel> Channels { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Director> Directors { get; set; }

    public virtual DbSet<Document> Documents { get; set; }

    public virtual DbSet<Facility> Facilities { get; set; }

    public virtual DbSet<Graphicset> Graphicsets { get; set; }

    public virtual DbSet<Operation> Operations { get; set; }

    public virtual DbSet<Operator> Operators { get; set; }

    public virtual DbSet<Refreshtoken> Refreshtokens { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Spending> Spendings { get; set; }

    public virtual DbSet<Spendingtype> Spendingtypes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=Taslak;Username=postgres;Password=123456");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresEnum("statusenum", new[] { "Maç kurulumu ve ön test tamamlandı", "Ulaşım (Şehirdışı) tamamlandı", "Salon/stada ulaşıldı", "Yayın testi tamamlandı", " yayına hazır", "Yayın tamamlandı", "Yayın iptal edildi", "Maç ertelendi", "Maç tatil edildi" });

        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasKey(e => e.Assignmentid).HasName("assignment_pkey");

            entity.ToTable("assignment");

            entity.Property(e => e.Assignmentid).HasColumnName("assignmentid");
            entity.Property(e => e.Operationid).HasColumnName("operationid");
            entity.Property(e => e.Operatorid).HasColumnName("operatorid");

            entity.HasOne(d => d.Operation).WithMany(p => p.Assignments)
                .HasForeignKey(d => d.Operationid)
                .HasConstraintName("assignment_operationid_fkey");

            entity.HasOne(d => d.Operator).WithMany(p => p.Assignments)
                .HasForeignKey(d => d.Operatorid)
                .HasConstraintName("assignment_operatorid_fkey");
        });

        modelBuilder.Entity<Branch>(entity =>
        {
            entity.HasKey(e => e.Branchid).HasName("branch_pkey");

            entity.ToTable("branch");

            entity.Property(e => e.Branchid).HasColumnName("branchid");
            entity.Property(e => e.Branchname)
                .HasMaxLength(255)
                .HasColumnName("branchname");
        });

        modelBuilder.Entity<Channel>(entity =>
        {
            entity.HasKey(e => e.Channelid).HasName("channel_pkey");

            entity.ToTable("channel");

            entity.Property(e => e.Channelid).HasColumnName("channelid");
            entity.Property(e => e.Channelname)
                .HasMaxLength(255)
                .HasColumnName("channelname");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.Cityid).HasName("city_pkey");

            entity.ToTable("city");

            entity.Property(e => e.Cityid).HasColumnName("cityid");
            entity.Property(e => e.Cityname)
                .HasMaxLength(255)
                .HasColumnName("cityname");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Customerid).HasName("customer_pkey");

            entity.ToTable("customer");

            entity.Property(e => e.Customerid).HasColumnName("customerid");
            entity.Property(e => e.Customername)
                .HasMaxLength(255)
                .HasColumnName("customername");
        });

        modelBuilder.Entity<Director>(entity =>
        {
            entity.HasKey(e => e.Directorid).HasName("director_pkey");

            entity.ToTable("director");

            entity.Property(e => e.Directorid).HasColumnName("directorid");
            entity.Property(e => e.Directorname)
                .HasMaxLength(255)
                .HasColumnName("directorname");
            entity.Property(e => e.Directorsurname)
                .HasMaxLength(255)
                .HasColumnName("directorsurname");
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Documentid).HasName("document_pkey");

            entity.ToTable("document");

            entity.Property(e => e.Documentid).HasColumnName("documentid");
            entity.Property(e => e.Documentimg).HasColumnName("documentimg");
            entity.Property(e => e.Spendingid).HasColumnName("spendingid");

            entity.HasOne(d => d.Spending).WithMany(p => p.Documents)
                .HasForeignKey(d => d.Spendingid)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_document_spending");
        });

        modelBuilder.Entity<Facility>(entity =>
        {
            entity.HasKey(e => e.Facilityid).HasName("facility_pkey");

            entity.ToTable("facility");

            entity.Property(e => e.Facilityid).HasColumnName("facilityid");
            entity.Property(e => e.Cityid).HasColumnName("cityid");
            entity.Property(e => e.Facilityname)
                .HasMaxLength(255)
                .HasColumnName("facilityname");

            entity.HasOne(d => d.City).WithMany(p => p.Facilities)
                .HasForeignKey(d => d.Cityid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("facility_cityid_fkey");
        });

        modelBuilder.Entity<Graphicset>(entity =>
        {
            entity.HasKey(e => e.Graphicsetid).HasName("graphicset_pkey");

            entity.ToTable("graphicset");

            entity.Property(e => e.Graphicsetid).HasColumnName("graphicsetid");
            entity.Property(e => e.Branchid).HasColumnName("branchid");
            entity.Property(e => e.Graphicsetname)
                .HasMaxLength(255)
                .HasColumnName("graphicsetname");

            entity.HasOne(d => d.Branch).WithMany(p => p.Graphicsets)
                .HasForeignKey(d => d.Branchid)
                .HasConstraintName("graphicset_branchid_fkey");
        });

        modelBuilder.Entity<Operation>(entity =>
        {
            entity.HasKey(e => e.Operationid).HasName("operation_pkey");

            entity.ToTable("operation");

            entity.Property(e => e.Operationid).HasColumnName("operationid");
            entity.Property(e => e.Branchid).HasColumnName("branchid");
            entity.Property(e => e.Channelid).HasColumnName("channelid");
            entity.Property(e => e.Cityid).HasColumnName("cityid");
            entity.Property(e => e.Customerid).HasColumnName("customerid");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Directorid).HasColumnName("directorid");
            entity.Property(e => e.Endingtime).HasColumnName("endingtime");
            entity.Property(e => e.Facilityid).HasColumnName("facilityid");
            entity.Property(e => e.Graphicsetid).HasColumnName("graphicsetid");
            entity.Property(e => e.Startingtime).HasColumnName("startingtime");

            entity.HasOne(d => d.Branch).WithMany(p => p.Operations)
                .HasForeignKey(d => d.Branchid)
                .HasConstraintName("operation_branchid_fkey");

            entity.HasOne(d => d.Channel).WithMany(p => p.Operations)
                .HasForeignKey(d => d.Channelid)
                .HasConstraintName("operation_channelid_fkey");

            entity.HasOne(d => d.City).WithMany(p => p.Operations)
                .HasForeignKey(d => d.Cityid)
                .HasConstraintName("operation_cityid_fkey");

            entity.HasOne(d => d.Customer).WithMany(p => p.Operations)
                .HasForeignKey(d => d.Customerid)
                .HasConstraintName("operation_customerid_fkey");

            entity.HasOne(d => d.Director).WithMany(p => p.Operations)
                .HasForeignKey(d => d.Directorid)
                .HasConstraintName("operation_directorid_fkey");

            entity.HasOne(d => d.Facility).WithMany(p => p.Operations)
                .HasForeignKey(d => d.Facilityid)
                .HasConstraintName("fk_operation_facility");

            entity.HasOne(d => d.Graphicset).WithMany(p => p.Operations)
                .HasForeignKey(d => d.Graphicsetid)
                .HasConstraintName("operation_graphicsetid_fkey");
        });

        modelBuilder.Entity<Operator>(entity =>
        {
            entity.HasKey(e => e.Operatorid).HasName("operator_pkey");

            entity.ToTable("operator");

            entity.Property(e => e.Operatorid).HasColumnName("operatorid");
            entity.Property(e => e.Operatorname)
                .HasMaxLength(255)
                .HasColumnName("operatorname");
            entity.Property(e => e.Operatorphonenumber).HasColumnName("operatorphonenumber");
            entity.Property(e => e.Operatorsurname)
                .HasMaxLength(255)
                .HasColumnName("operatorsurname");
        });

        modelBuilder.Entity<Refreshtoken>(entity =>
        {
            entity.HasKey(e => e.Token).HasName("refreshtokens_pkey");

            entity.ToTable("refreshtokens");

            entity.Property(e => e.Token)
                .HasMaxLength(255)
                .HasColumnName("token");
            entity.Property(e => e.Expirydatetime)
                .HasColumnType("timestamp with time zone")
    .HasColumnName("expirydatetime");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.User).WithMany(p => p.Refreshtokens)
                .HasForeignKey(d => d.Userid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("refreshtokens_userid_fkey");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Roleid).HasName("roles_pkey");

            entity.ToTable("roles");

            entity.Property(e => e.Roleid).HasColumnName("roleid");
            entity.Property(e => e.Rolename)
                .HasMaxLength(50)
                .HasColumnName("rolename");
        });

        modelBuilder.Entity<Spending>(entity =>
        {
            entity.HasKey(e => e.Spendingid).HasName("spending_pkey");

            entity.ToTable("spending");

            entity.Property(e => e.Spendingid).HasColumnName("spendingid");
            entity.Property(e => e.Operationid).HasColumnName("operationid");
            entity.Property(e => e.Operatorid).HasColumnName("operatorid");
            entity.Property(e => e.Spendingamount)
                .HasPrecision(10, 2)
                .HasColumnName("spendingamount");
            entity.Property(e => e.Spendingdate).HasColumnName("spendingdate");
            entity.Property(e => e.Spendingtypeid).HasColumnName("spendingtypeid");

            entity.HasOne(d => d.Operation).WithMany(p => p.Spendings)
                .HasForeignKey(d => d.Operationid)
                .HasConstraintName("spending_operationid_fkey");

            entity.HasOne(d => d.Operator).WithMany(p => p.Spendings)
                .HasForeignKey(d => d.Operatorid)
                .HasConstraintName("fk_spending_operator");

            entity.HasOne(d => d.Spendingtype).WithMany(p => p.Spendings)
                .HasForeignKey(d => d.Spendingtypeid)
                .HasConstraintName("spending_spendingtypeid_fkey");
        });

        modelBuilder.Entity<Spendingtype>(entity =>
        {
            entity.HasKey(e => e.Spendingtypeid).HasName("spendingtype_pkey");

            entity.ToTable("spendingtype");

            entity.Property(e => e.Spendingtypeid).HasColumnName("spendingtypeid");
            entity.Property(e => e.Spendingtypename)
                .HasMaxLength(255)
                .HasColumnName("spendingtypename");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Userid).HasName("users_pkey");

            entity.ToTable("users");

            entity.Property(e => e.Userid).HasColumnName("userid");
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .HasColumnName("password");
            entity.Property(e => e.Roleid).HasColumnName("roleid");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.Roleid)
                .HasConstraintName("users_roleid_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
