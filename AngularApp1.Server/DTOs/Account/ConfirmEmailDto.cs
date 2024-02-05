using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Account
{
    public class ConfirmEmailDto
    {
        [Required]
        public string Token { get; set; }
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage = "Zły adres e-mail")]
        public string Email { get; set; }
    }
}
