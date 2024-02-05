using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace backend.Model
{
    public class User : IdentityUser
    {
        [Required]
        public string FirstName {  get; set; }
        [Required]
        public string LastName { get; set; }
        public DateTime DataCreated { get; set; }=DateTime.UtcNow;

    }
}
