using System.ComponentModel.DataAnnotations;

public class SaveTierListImagesDto
{
    public List<ImagePositionDto> Images { get; set; } = [];
}

public class ImagePositionDto
{
    [Required]
    public Guid Id { get; set; }

    public Guid? TierRowId { get; set; }

    [Range(0, int.MaxValue)]
    public int Order { get; set; }
}