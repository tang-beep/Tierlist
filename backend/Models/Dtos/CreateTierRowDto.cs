namespace backend.Models
{
    public class CreateTierRowDto
    {
        public string Name { get; set; } = "";
        public string Color { get; set; } = "#ffffff";
        public int Order { get; set; }
    }
}
