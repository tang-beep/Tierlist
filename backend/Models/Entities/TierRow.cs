using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class TierRow
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = "";

        [Required]
        [MaxLength(7)]
        public string Color { get; set; } = "#ffffff";
        
        // Ordre dans la TierList
        public int Order { get; set; }

        public Guid TierListId { get; set; }
        public TierList TierList { get; set; } = null!;

        public List<TierImage> Images { get; set; } = new();
    }
}
