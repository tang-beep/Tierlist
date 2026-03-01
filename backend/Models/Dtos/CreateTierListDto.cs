using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class CreateTierListDto
    {
        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string Name { get; set; } = "";

        [MinLength(1)]
        public List<CreateTierRowDto> Rows { get; set; } = new();
        
        [MinLength(1)]
        public List<int> ImageIds { get; set; } = new();
    }
}
