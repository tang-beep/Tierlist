using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ImageItem> ImageItems { get; set; }
        public DbSet<TierList> TierLists { get; set; }
        public DbSet<TierRow> TierRows { get; set; }
        public DbSet<TierImage> TierImages { get; set; }
    }
}
