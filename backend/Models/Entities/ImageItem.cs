using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    /* Images stockées sur le disque */
    public class ImageItem
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string Title { get; set; } = "";

        [MaxLength(300)]
        public string Tag { get; set; } = "";

        // Chemin du fichier sur le disque (dans le conteneur)
        [Required]
        [MaxLength(255)]
        public string FilePath { get; set; } = "";
    }
}
