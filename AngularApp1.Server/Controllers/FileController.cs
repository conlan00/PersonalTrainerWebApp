using backend.Repositories.ItemRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IHostEnvironment _hostEnvironment;
        public FileController(IHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet("get/{fileName}")]
        public IActionResult GetFile(string fileName)
        {
            try
            {
                var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "assets/imgItems", fileName);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                var fileBytes = System.IO.File.ReadAllBytes(filePath);
                return File(fileBytes, "image/jpeg");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }


        //[Authorize(Roles = "User")]
        [Authorize(Roles = "Admin")]
        [HttpPost("uploadFile")]
        public async Task<IActionResult> UploadFile()
        {

            try
            {
                var file = Request.Form.Files[0]; // Pobierz przesłany plik
                var folderPath = Path.Combine(_hostEnvironment.ContentRootPath, "assets/imgItems"); // Określ folder docelowy

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Błąd podczas przesyłania pliku: {ex.Message}");
                return BadRequest();
            }


        }
    }
}
