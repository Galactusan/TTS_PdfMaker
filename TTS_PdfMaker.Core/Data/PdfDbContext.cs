using Microsoft.EntityFrameworkCore;
using TTS_PdfMaker.Core.Models;

namespace TTS_PdfMaker.Core.Data;

public class PdfDbContext : DbContext
{
    public PdfDbContext(DbContextOptions<PdfDbContext> options) : base(options)
    {
    }

    public DbSet<PdfDocument> PdfDocuments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PdfDocument>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Content).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.HasIndex(e => e.CreatedAt);
        });
    }
}