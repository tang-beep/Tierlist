namespace backend.Models
{
    public class TierList
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";

        public List<TierRow> Rows { get; set; } = new();
        public List<TierImage> TierImages { get; set; } = new();

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
