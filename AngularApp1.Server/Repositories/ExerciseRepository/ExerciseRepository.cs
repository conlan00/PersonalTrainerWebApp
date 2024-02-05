using backend.Data;
using backend.ModelsTrainer;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.ExerciseRepository
{
    public class ExerciseRepository : IExerciseRepository
    {

        private readonly TrainerDbContext _trainerDbContext;

        public ExerciseRepository(TrainerDbContext trainerDbContext)
        {
            _trainerDbContext = trainerDbContext;
        }
        public async Task<bool> AddExercise(string newExercise)
        {
            var isExistingExercise = await _trainerDbContext.Exercises.AnyAsync(i => i.Name == newExercise);

            if (!isExistingExercise)
            {
                var highestId = await _trainerDbContext.Exercises.MaxAsync(i => (int?)i.IdExercise) ?? 0;
                var ExerciseToAdd = new Exercise
                {
                    IdExercise=highestId+1,
                    Name = newExercise,
                };
                _trainerDbContext.Exercises.Add(ExerciseToAdd);
                await _trainerDbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<bool> DeleteExercise(string exerciseName)
        {
            var isExistingExercise = await _trainerDbContext.Exercises.FirstOrDefaultAsync(i => i.Name == exerciseName);

            if (isExistingExercise != null)
            {
                _trainerDbContext.Exercises.Remove(isExistingExercise);
                await _trainerDbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
        public async Task<IEnumerable<Exercise>> GetExercise()
        {
            return await _trainerDbContext.Exercises.ToListAsync();
        }

    }
}
