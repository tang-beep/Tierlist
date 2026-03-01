using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class CreateTierRowDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = "";

        [Required]
        [RegularExpression("^#[0-9A-Fa-f]{6}$")]
        public string Color { get; set; } = "#ffffff";
        
        [Range(0, int.MaxValue)]
        public int Order { get; set; }
    }
}
