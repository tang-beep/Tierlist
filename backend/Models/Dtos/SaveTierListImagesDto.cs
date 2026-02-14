public class SaveTierListImagesDto
{
    public List<ImagePositionDto> Images { get; set; } = [];
}

public class ImagePositionDto
{
    public Guid Id { get; set; }
    public Guid? TierRowId { get; set; }
    public int Order { get; set; }
}