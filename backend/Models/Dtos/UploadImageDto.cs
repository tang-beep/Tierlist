using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UploadImageDto
    {
        [Required]
        public IFormFile? File { get; set; }

        [Required]
        [StringLength(30)]
        public string Title { get; set; } = "Sans titre";

        [StringLength(300)]
        public string Tag { get; set; } = "Sans tag";
    }
}
