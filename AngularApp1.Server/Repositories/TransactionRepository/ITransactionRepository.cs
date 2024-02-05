using backend.DTOs.BusinessDto;
using backend.ModelsTrainer;
using Microsoft.AspNetCore.Mvc;

namespace backend.Repositories.TransactionRepository
{
    public interface ITransactionRepository
    {
        Task<IEnumerable<TransactionDto>> GetTransactionsByEmail(string emailUser);
        Task<decimal?> GetItemIdByNameAsync(string itemName);
        Task<bool> CreateTransaction(Transaction newTransaction);
        Task<IEnumerable<PieChart>> GetItemCount();
        Task<IEnumerable<RevenueDto>> GetItemRevenue();
        Task<IEnumerable<TotalRevenueDto>> GetTotalRevenue();
    }
}
