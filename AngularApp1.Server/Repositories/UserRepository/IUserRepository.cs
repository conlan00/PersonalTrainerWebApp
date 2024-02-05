using backend.DTOs.BusinessDto;

namespace backend.Repositories.UserRepository
{
    public interface IUserRepository
    {
        Task<NumberUsersDto> GetNumberOfUsers();
    }
}
