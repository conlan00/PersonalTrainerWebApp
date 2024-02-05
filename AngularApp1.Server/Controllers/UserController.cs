using backend.DTOs.BusinessDto;
using backend.Repositories.TransactionRepository;
using backend.Repositories.UserRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        //autoryzacja jako admin 
        [Authorize(Roles = "Admin")]
        [HttpGet("numberUsers")]
        public async Task<ActionResult<IEnumerable<NumberUsersDto>>> GetNumberOfUsers()
        {
            var Data = await _userRepository.GetNumberOfUsers();
            return Ok(Data);
        }
    }
}
