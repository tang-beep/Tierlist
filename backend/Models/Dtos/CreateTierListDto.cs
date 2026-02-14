namespace backend.Models
{
    public class CreateTierListDto
    {
        public string Name { get; set; } = "";
        public List<CreateTierRowDto> Rows { get; set; } = new();
        public List<int> ImageIds { get; set; } = new();
    }
}
