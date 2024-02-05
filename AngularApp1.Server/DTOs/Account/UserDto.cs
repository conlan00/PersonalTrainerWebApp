using System.Security.Principal;

namespace backend.DTOs.Account
{
    public class UserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string JWT { get; set; }
    }
}
