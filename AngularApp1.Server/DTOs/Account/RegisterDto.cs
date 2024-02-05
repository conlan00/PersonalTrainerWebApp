using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Account
{
    public class RegisterDto
    {
        [Required]
        [StringLength(15,MinimumLength =3,ErrorMessage ="Imie musi miec minimum {2} i maximum {1} zanki")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Nazwisko musi miec minimum {2} i maximum {1} zanki")]
        public string LastName { get; set; }
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage = "Zły adres e-mail")]
        public string Email { get; set; }
        [Required]
        [StringLength(15, MinimumLength = 8, ErrorMessage = "Haslo musi miec minimum {2} i maximum {1} zanki")]
        public string Password { get; set; }

    }
}
