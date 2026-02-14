namespace backend.Models
{
    public class UploadImageDto
    {
        public IFormFile? File { get; set; }
        public string Title { get; set; } = "Sans titre";
        public string Tag { get; set; } = "Sans tag";
    }
}
