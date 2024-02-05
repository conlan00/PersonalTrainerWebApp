using System.Text.Json.Serialization;

namespace backend.DTOs.BusinessDto
{
    public class PieChart
    {
        public string ItemName { get; set; }
        public int Count { get; set; }
        public DateTimeOffset dateOfTransacton { get; set; }
        public string LastTransactionDateString { get; set; }
        public decimal Price { get; set; }
    }
}
