using backend.DTOs.BusinessDto;
using backend.ModelsTrainer;

namespace backend.Repositories.TrainingRepository
{
    public interface ITrainingRepository
    {
        Task<IEnumerable<BusinessTrainingDto>> GetTrainingByEmail(string emailUser);
        Task<IEnumerable<EmptyUserDto>> GetUsersWithoutTraining();
        Task<bool> CreateTraining(List<TrainingDto> newTraining);
    }
}
