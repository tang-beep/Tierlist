using System.ComponentModel.DataAnnotations;

public class SaveTierListRowsDto
{
    [Required]
    [MinLength(1)]
    [MaxLength(100)]
    public List<TierRowDto> Rows { get; set; } = new();
}

public class TierRowDto
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Name { get; set; } = "";

    [Required]
    [RegularExpression("^#[0-9A-Fa-f]{6}$")]
    public string Color { get; set; } = "";

    [Range(0, int.MaxValue)]
    public int Order { get; set; }
}