namespace backend.Models
{
    public class TierRow
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public string Color { get; set; } = "#ffffff";
        
        // Ordre dans la TierList
        public int Order { get; set; }

        public Guid TierListId { get; set; }
        public TierList TierList { get; set; } = null!;

        public List<TierImage> Images { get; set; } = new();
    }
}
