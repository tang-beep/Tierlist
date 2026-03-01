using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    /*
    Contrôleur qui gère toutes les actions liées aux tierlists
    (Création, récupérer une tierlist, ajouter ou supprimer des images, 
    sauvegarder les modifications)
    */
    [ApiController]
    [Route("api/[controller]")]
    public class TierListsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TierListsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTierListDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.TierLists.AnyAsync(t => t.Name.ToLower() == dto.Name.ToLower()))
                return BadRequest("Une tierlist avec ce nom existe déjà");

            var images = await _context.ImageItems
                .Where(i => dto.ImageIds.Contains(i.Id))
                .ToListAsync();

            if (images.Count != dto.ImageIds.Count)
                return BadRequest("Certaines images sont introuvables");

            var tierList = new TierList
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            foreach (var row in dto.Rows)
            {
                tierList.Rows.Add(new TierRow
                {
                    Id = Guid.NewGuid(),
                    Name = row.Name,
                    Color = row.Color,
                    Order = row.Order,
                    TierList = tierList
                });
            }

            foreach (var img in images)
            {
                tierList.TierImages.Add(new TierImage
                {
                    Id = Guid.NewGuid(),
                    ImageItem = img,
                    TierList = tierList
                });
            }

            _context.TierLists.Add(tierList);
            await _context.SaveChangesAsync();

            return Ok(new { tierList.Id });
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var lists = _context.TierLists
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.CreatedAt,
                    t.UpdatedAt
                })
                .OrderByDescending(t => t.UpdatedAt)
                .ToList();

            return Ok(lists);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var tierList = await _context.TierLists
                .Include(t => t.Rows.OrderBy(r => r.Order))
                .Include(t => t.TierImages)
                    .ThenInclude(ti => ti.ImageItem)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tierList == null)
                return NotFound();

            return Ok(new
            {
                tierList.Id,
                tierList.Name,
                Rows = tierList.Rows.Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Color,
                    r.Order
                }),
                Images = tierList.TierImages.Select(ti => new
                {
                    ti.Id,
                    ImageId = ti.ImageItem.Id,
                    ti.ImageItem.Title,
                    ti.ImageItem.FilePath,
                    ti.ImageItem.Tag,
                    ti.TierRowId
                })
            });
        }

        [HttpPut("{tierListId}/images")]
        public async Task<IActionResult> SaveImages(Guid tierListId, [FromBody] SaveTierListImagesDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var images = await _context.TierImages
                .Where(i => i.TierListId == tierListId)
                .ToListAsync();

            foreach (var imgDto in dto.Images)
            {
                var image = images.FirstOrDefault(i => i.Id == imgDto.Id);
                if (image == null)
                    return BadRequest("Image invalide.");

                image.TierRowId = imgDto.TierRowId;
                image.Order = imgDto.Order;
            }

            await UpdateLastModified(tierListId);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{tierListId}/images")]
        public async Task<IActionResult> AddImages(Guid tierListId, [FromBody] AddTierListImagesDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var tierListExists = await _context.TierLists.AnyAsync(t => t.Id == tierListId);
            if (!tierListExists)
                return NotFound("TierList introuvable.");

            var validImageIds = await _context.ImageItems
                .Where(i => dto.ImageItemIds.Contains(i.Id))
                .Select(i => i.Id)
                .ToListAsync();

            if (validImageIds.Count != dto.ImageItemIds.Count)
                return BadRequest("Certaines images sont invalides.");

            var uniqueIds = validImageIds.Distinct().ToList();

            var maxOrder = await _context.TierImages
                .Where(t => t.TierListId == tierListId)
                .MaxAsync(t => (int?)t.Order) ?? 0;

            foreach (var imageId in uniqueIds)
            {
                _context.TierImages.Add(new TierImage
                {
                    Id = Guid.NewGuid(),
                    TierListId = tierListId,
                    ImageItemId = imageId,
                    TierRowId = null,
                    Order = ++maxOrder
                });
            }

            await UpdateLastModified(tierListId);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{tierListId}/images")]
        public async Task<IActionResult> RemoveImages(Guid tierListId, [FromBody] RemoveTierListImagesDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var images = await _context.TierImages
                .Where(t =>
                    t.TierListId == tierListId &&
                    dto.TierListImageIds.Contains(t.Id))
                .ToListAsync();

            await UpdateLastModified(tierListId);
            _context.TierImages.RemoveRange(images);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{tierListId}/rows")]
        public async Task<IActionResult> SaveRows(Guid tierListId, [FromBody] SaveTierListRowsDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var tierListExists = await _context.TierLists
                .AnyAsync(t => t.Id == tierListId);

            if (!tierListExists)
                return NotFound("TierList introuvable");

            var rows = await _context.TierRows
                .Where(r => r.TierListId == tierListId)
                .ToListAsync();

            _context.TierRows.RemoveRange(rows);

            foreach (var row in dto.Rows)
            {
                _context.TierRows.Add(new TierRow
                {
                    Id = row.Id,
                    TierListId = tierListId,
                    Name = row.Name,
                    Color = row.Color,
                    Order = row.Order
                });
            }

            await UpdateLastModified(tierListId);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task UpdateLastModified(Guid tierListId)
        {
            var tierList = await _context.TierLists.FindAsync(tierListId);
            if (tierList != null)
                tierList.UpdatedAt = DateTime.UtcNow;
        }
    }
}
