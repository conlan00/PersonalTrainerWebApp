using backend.Data;
using backend.DTOs.BusinessDto;
using backend.ModelsTrainer;
using Microsoft.EntityFrameworkCore;
namespace backend.Repositories.UserRepository
{
    public class UserRepository :IUserRepository
    {
        private readonly TrainerDbContext _trainerDbContext;

        public UserRepository(TrainerDbContext trainerDbContext)
        {
            _trainerDbContext = trainerDbContext;
        }

        public async Task<NumberUsersDto> GetNumberOfUsers()
        {
            var numberOfUsers = await _trainerDbContext.Users
                .Where(user => user.Email != null)  
                .CountAsync();
            NumberUsersDto result = new NumberUsersDto {
            number = numberOfUsers
            };
            return result;
        }


    }
}
