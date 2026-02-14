namespace backend.Models
{
    /* Images associées à une tierlist, qui référencent une image stockée sur le disque */
    public class TierImage
    {
        public Guid Id { get; set; }

        // Référence ImageItem
        public int ImageItemId { get; set; }
        public ImageItem ImageItem { get; set; } = null!;

        public Guid TierListId { get; set; }
        public TierList TierList { get; set; } = null!;

        // Images non placées n'ont pas de Row
        public Guid? TierRowId { get; set; }
        public TierRow? TierRow { get; set; }

        // Ordre dans la Row
        public int Order { get; set; }
    }
}
