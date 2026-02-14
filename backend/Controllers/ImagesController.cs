using backend.Models;
using backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /*
    Contrôleur qui gère toutes les actions liées aux images stockées en base
    (Upload, récupérer les images, les tags, supprimer des images)
    */
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ImagesController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] UploadImageDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("Aucun fichier.");

            // Dossier où stocker les images
            var imagesDir = Path.Combine(_env.ContentRootPath, "images");
            Directory.CreateDirectory(imagesDir);

            // Nom unique
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.File.FileName);
            var filePath = Path.Combine(imagesDir, fileName);

            // Enregistrer le fichier
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            // Sauvegarde en base
            var img = new ImageItem
            {
                Title = dto.Title,
                Tag = dto.Tag,
                FilePath = $"{baseUrl}/images/{fileName}"
            };

            _context.ImageItems.Add(img);
            await _context.SaveChangesAsync();

            return Ok(img);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var images = _context.ImageItems.ToList();
            return Ok(images);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var img = _context.ImageItems.Find(id);
            if (img == null) return NotFound();
            return Ok(img);
        }

        [HttpGet("tag/{tag}")]
        public IActionResult GetByTag(string tag)
        {
            var imgs = _context.ImageItems
                .Where(i => i.Tag.ToLower() == tag.ToLower())
                .ToList();

            return Ok(imgs);
        }

        [HttpGet("search/{title}")]
        public IActionResult Search(string title)
        {
            var imgs = _context.ImageItems
                .Where(i => i.Title.ToLower().Contains(title.ToLower()))
                .ToList();

            return Ok(imgs);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var img = await _context.ImageItems.FindAsync(id);
            if (img == null) return NotFound();

            // Supprimer fichier physique
            var path = Path.Combine(_env.ContentRootPath, "images", Path.GetFileName(img.FilePath));

            if (System.IO.File.Exists(path))
                System.IO.File.Delete(path);

            _context.ImageItems.Remove(img);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("tags")]
        public IActionResult GetTags()
        {
            var images = _context.ImageItems
                .Where(i => i.Tag != null && i.Tag != "")
                .ToList();

            var tags = images
                .SelectMany(i => i.Tag
                    .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
                .Distinct()
                .ToList();

            return Ok(tags);
        }
    }
}
