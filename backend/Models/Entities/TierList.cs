using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class TierList
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = "";

        public List<TierRow> Rows { get; set; } = new();
        public List<TierImage> TierImages { get; set; } = new();

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
