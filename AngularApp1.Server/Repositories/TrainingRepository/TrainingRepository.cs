using backend.Data;
using backend.DTOs.BusinessDto;
using backend.ModelsTrainer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace backend.Repositories.TrainingRepository
{
    public class TrainingRepository : ITrainingRepository
    {
        private readonly TrainerDbContext _trainerDbContext;
        public TrainingRepository(TrainerDbContext trainerDbContext)
        {
            _trainerDbContext = trainerDbContext;
        }

        public async Task<IEnumerable<BusinessTrainingDto>> GetTrainingByEmail(string emailUser)
        {
            return await _trainerDbContext.Training
            .Where(t => t.IdTransactionNavigation.EmailUser == emailUser)
            .Select(t => new BusinessTrainingDto
            {
                ExerciseName = t.IdExerciseNavigation.Name,
                DayOfWeek = t.DayOfWeek
            })
            .ToListAsync();
        }
        public async Task<IEnumerable<EmptyUserDto>> GetUsersWithoutTraining()
        {
            return  await _trainerDbContext.Users
                .Join(_trainerDbContext.Transactions, u => u.Email, t => t.EmailUser, (u, t) => new { User = u, Transaction = t })
                .Join(_trainerDbContext.Items, ut => ut.Transaction.IdItem, it => it.IdItem, (ut, it) => new { ut.User, ut.Transaction, Item = it })
                .GroupJoin(_trainerDbContext.Training, uti => uti.Transaction.IdTransaction, tr => tr.IdTransaction, (uti, tr) => new { uti.User, uti.Transaction, uti.Item, Training = tr.DefaultIfEmpty() })
                .Where(uti => uti.Training.All(tr => tr == null))
                .Select(uti => new EmptyUserDto
                {
                    Email=uti.User.Email,
                    ItemName = uti.Item.Name,
                    Days = uti.Item.Days.ToString(),
                    IdTransaction = uti.Transaction.IdTransaction.ToString(),
                })
                .ToListAsync();
        }
        public async Task<bool> CreateTraining(List<TrainingDto> newTraining)
        {
            try
            {
                for (int i = 0; i < newTraining.Count(); i++)
                {
                    var highestId = await _trainerDbContext.Training.MaxAsync(i => (int?)i.IdExercise) ?? 0;
                    var trainingToAdd = new Training
                    {
                        IdTraining=highestId+1,
                        DayOfWeek = Convert.ToByte(newTraining[i].DayOfWeek),
                        IdExercise = Convert.ToInt32(newTraining[i].IdExercise),
                        IdTransaction = Convert.ToInt32(newTraining[i].IdTransaction),
                    };
                    _trainerDbContext.Training.Add(trainingToAdd);
                    await _trainerDbContext.SaveChangesAsync();
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
