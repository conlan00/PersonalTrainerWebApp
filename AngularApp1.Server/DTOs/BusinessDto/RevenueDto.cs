namespace backend.DTOs.BusinessDto
{
    public class RevenueDto
    {
        public DateTimeOffset dateOfTransacton { get; set; }
        public string LastTransactionDateString { get; set; }
        public decimal Revenue { get; set; }
    }
}
