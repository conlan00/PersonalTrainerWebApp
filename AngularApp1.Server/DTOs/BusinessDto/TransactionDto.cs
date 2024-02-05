using backend.DTOs.Account;

namespace backend.DTOs.BusinessDto
{
    public class TransactionDto
    {
        public bool IsPaid { get; set; }
        public string? EmailUser { get; set; }
        public BussinessItemDto Item { get; set; }
        public BusinessUserDto User { get; set; }
    }
}
