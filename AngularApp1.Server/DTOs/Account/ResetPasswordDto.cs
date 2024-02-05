using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Account
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage = "Zły adres e-mail")]
        public string Email { get; set; }
        [Required]
        [StringLength(15, MinimumLength = 8, ErrorMessage = "Nowe haslo musi miec minimum {2} i maximum {1} zanki")]
        public string NewPassword { get; set; }    
    }
}
