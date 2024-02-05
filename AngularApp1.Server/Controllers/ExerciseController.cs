using backend.DTOs.Account;
using backend.DTOs.BusinessDto;
using backend.ModelsTrainer;
using backend.Repositories.ExerciseRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System.Globalization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {
        private readonly IExerciseRepository _exerciseRepository;
        public ExerciseController(IExerciseRepository exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }
        //autoryzowane musi byc przez admina
        [Authorize(Roles = "Admin")]
        [HttpPost("addExercise")]
        public async Task<IActionResult> AddExercise(ExerciseDto model)
        {
            if (await _exerciseRepository.AddExercise(model.exercise))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }

        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteExercise/{exercise}")]
        public async Task<IActionResult> DeleteItem(string exercise)
        {

            var deleteExercise = await _exerciseRepository.DeleteExercise(exercise);
            if (deleteExercise)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        //autoryzowane musi byc przez admina
        [Authorize(Roles = "Admin")]
        [HttpGet("getExercises")]
        public async Task<ActionResult<IEnumerable<Exercise>>> GetItems()
        {
            var exercises = await _exerciseRepository.GetExercise();
            //var exercisesNames = exercises.Select(exercise => exercise.Name).ToList();
            return Ok(exercises);
        }

    }
}
