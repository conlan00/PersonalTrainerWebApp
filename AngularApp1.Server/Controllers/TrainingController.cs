using backend.DTOs.BusinessDto;
using backend.Repositories.TrainingRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingController : ControllerBase
    {
        private readonly ITrainingRepository _trainingRepository;
        public TrainingController(ITrainingRepository trainingRepository)
        {
            _trainingRepository = trainingRepository;
        }
        [Authorize(Roles = "User")]
        [HttpGet("getTraining")]
        public async Task<ActionResult<IEnumerable<BusinessTrainingDto>>> GetTrainingByEmail()
        {
            var request = Request.Cookies["backend_token"];
            var handler = new JwtSecurityTokenHandler();
            var decode = handler.ReadToken(request) as JwtSecurityToken;
            var email = decode.Claims.FirstOrDefault(x => x.Type == "email");
            var traningDto = await _trainingRepository.GetTrainingByEmail(email.Value);
            return Ok(traningDto);
        }
        //autoryzacja przez admina
        [Authorize(Roles = "Admin")]
        [HttpGet("getUsersWithoutTraining")]
        public async Task<ActionResult<IEnumerable<EmptyUserDto>>> GetUsersWithoutTraining()
        {
            var result = await _trainingRepository.GetUsersWithoutTraining();
            return Ok(result);
        }
        //autoryzacja przez admina
        [Authorize(Roles = "Admin")]
        [HttpPost("createTraining")]
        public async Task<IActionResult> CreateTraining(List<TrainingDto> model)
        {
            if (model != null)
            {
                await _trainingRepository.CreateTraining(model);
                return Ok();
            }
            else
            {
                return BadRequest();
            }

        }
    }
}
