namespace backend.Models
{
    /* Images stockées sur le disque */
    public class ImageItem
    {
        public int Id { get; set; }

        public string Title { get; set; } = "";

        public string Tag { get; set; } = "";

        // Chemin du fichier sur le disque (dans le conteneur)
        public string FilePath { get; set; } = "";
    }
}
