using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenAI_API.Completions;
using OpenAI_API;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OpenAiController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        OpenAiController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet("getDiets")]
        public async Task<ActionResult<string>> GetData([FromQuery] string kcal, [FromQuery] string adds)
        {
            string apiKey = "Your Open AI KEY";
            string response = "";
            OpenAIAPI openai = new OpenAIAPI(apiKey);
            CompletionRequest completion = new CompletionRequest();
            completion.Prompt = $"Jadłospis na dzień zawartość kaloryczna {kcal} kcal. {adds}. Do każdego składnika zawartość makroskładników. ";
            completion.MaxTokens = 1000;
            var output = await openai.Completions.CreateCompletionAsync(completion);
            if (output != null)
            {
                foreach (var item in output.Completions)
                {
                    response = item.Text;
                }
                return Ok(new JsonResult(response));
            }
            else
            {
                return BadRequest("Not found");
            }
        }
    }
}
