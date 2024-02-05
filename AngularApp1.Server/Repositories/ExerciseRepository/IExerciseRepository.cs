using backend.ModelsTrainer;

namespace backend.Repositories.ExerciseRepository
{
    public interface IExerciseRepository
    {
        Task<bool> AddExercise(string newExercise);
        Task<bool> DeleteExercise(string exerciseName);
        Task<IEnumerable<Exercise>> GetExercise();
    }
}
