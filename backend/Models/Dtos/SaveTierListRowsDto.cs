public class SaveTierListRowsDto
{
    public List<TierRowDto> Rows { get; set; } = new();
}

public class TierRowDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string Color { get; set; } = "";
    public int Order { get; set; }
}