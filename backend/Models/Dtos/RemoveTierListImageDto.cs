namespace backend.Models
{
    public class RemoveTierListImagesDto
    {
        public List<Guid> TierListImageIds { get; set; } = new();
    }
}