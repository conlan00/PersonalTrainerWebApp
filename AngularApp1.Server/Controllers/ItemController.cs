using backend.DTOs.Account;
using backend.ModelsTrainer;
using backend.Repositories.ItemRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IItemRepository _itemRepository;
        private readonly IHostEnvironment _hostEnvironment;
        public ItemController(IItemRepository itemRepository, IHostEnvironment hostEnvironment)
        {
            _itemRepository = itemRepository;
            _hostEnvironment = hostEnvironment;
        }


        [HttpGet("getItem")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            var items = await _itemRepository.GetItems();
            var itemDTOs = items.Select(MapToDTO);
            return Ok(itemDTOs);
        }
        //autoryzowany przez admina musi byc
        [Authorize(Roles = "Admin")]
        [HttpPost("addItem")]
        public async Task<IActionResult> AddItems(Item model)
        {
            var ItemToAdd = new Item
            {
                Name = model.Name,
                Price = model.Price,
                Days = model.Days,
            };
            var items = await _itemRepository.AddItem(ItemToAdd);

            return Ok();
        }
        //autoryzowany przez admina musi byc
        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteItem/{itemName}")]
        public async Task<IActionResult> DeleteItem(string itemName)
        {

            var deleteItem = await _itemRepository.DeleteItem(itemName);
            var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "assets/imgItems", itemName + ".jpg");
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }
            System.IO.File.Delete(filePath);


            return Ok();
        }

        private ItemDto MapToDTO(Item item)
        {
            return new ItemDto
            {
                Name = item.Name,
                Price = item.Price,
            };
        }

    }
}
