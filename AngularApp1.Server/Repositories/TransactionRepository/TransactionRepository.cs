using backend.Data;
using backend.DTOs.Account;
using backend.DTOs.BusinessDto;
using backend.ModelsTrainer;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace backend.Repositories.TransactionRepository
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly TrainerDbContext _trainerDbContext;

        public TransactionRepository(TrainerDbContext trainerDbContext)
        {
            _trainerDbContext = trainerDbContext;
        }

        public async Task<IEnumerable<TransactionDto>> GetTransactionsByEmail(string emailUser)
        {
            var transactions = await _trainerDbContext.Transactions
                .Include(t => t.IdItemNavigation)
                .Include(t => t.EmailUserNavigation)
                .Where(t => t.EmailUser == emailUser)
                .ToListAsync();

            var transactionDTOs = transactions.Select(t => new TransactionDto
            {
                IsPaid = t.IsPaid,
                EmailUser = t.EmailUser,
                Item = new BussinessItemDto
                {
                    Name = t.IdItemNavigation.Name,
                    Price = t.IdItemNavigation.Price,
                    Days = t.IdItemNavigation.Days
                },
                User = new BusinessUserDto
                {
                    Name = t.EmailUserNavigation.Name,
                    Surname = t.EmailUserNavigation.Surname
                }
            });

            return transactionDTOs;
        }
        public async Task<decimal?> GetItemIdByNameAsync(string itemName)
        {
            var itemId = await _trainerDbContext.Items
                .Where(item => item.Name == itemName)
                .Select(item => (decimal?)item.IdItem)
                .FirstOrDefaultAsync();

            return itemId;
        }
        public async Task<bool> CreateTransaction(Transaction newTransaction)
        {
            try
            {
                _trainerDbContext.Transactions.Add(newTransaction);
                await _trainerDbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<IEnumerable<PieChart>> GetItemCount()
        {
            var result = _trainerDbContext.Items
            .GroupJoin(
                _trainerDbContext.Transactions,
                i => i.IdItem,
                t => t.IdItem,
                (item, transactions) => new { Item = item, Transactions = transactions }
            )
            .SelectMany(
                x => x.Transactions.DefaultIfEmpty(),
                (x, transaction) => new { Item = x.Item, Transaction = transaction }
            )
            .Where(x => x.Transaction != null)  // Dodaj warunek, aby uwzględniać tylko te elementy, które mają przynajmniej jedną transakcję
            .GroupBy(
                x => x.Item.Name,
                (key, group) => new PieChart
                {
                    ItemName = key,
                    Count = group.Count(),
                    dateOfTransacton = group.Max(x => x.Transaction.DateOfTransaction),
                    Price = group.FirstOrDefault().Item.Price
                }
            )
            .ToList();
            foreach (var pieChart in result)
            {
                pieChart.LastTransactionDateString = pieChart.dateOfTransacton.ToString("yyyy-MM-ddTHH:mm:sszzz");
            }
            return result;
        }
        public async Task<IEnumerable<RevenueDto>> GetItemRevenue()
        {
            var endDate = DateTime.UtcNow.Date; // Aktualna data
            var startDate = endDate.AddDays(-7); // Data sprzed 7 dni

            var result = _trainerDbContext.Transactions
                .Where(t => t.DateOfTransaction >= startDate && t.DateOfTransaction <= endDate)
                .Join(
                    _trainerDbContext.Items,
                    t => t.IdItem,
                    i => i.IdItem,
                    (transaction, item) => new { Transaction = transaction, Item = item }
                )
                .GroupBy(
                    x => x.Transaction.DateOfTransaction.Date,
                    (key, group) => new RevenueDto
                    {
                        dateOfTransacton = key,
                        LastTransactionDateString = key.ToString("yyyy-MM-ddTHH:mm:sszzz"),
                        Revenue = group.Sum(x => x.Item.Price)
                    }
                )
                .ToList();

            return result;
        }

        public async Task<IEnumerable<TotalRevenueDto>> GetTotalRevenue()
        {
            var result = await _trainerDbContext.Transactions
                .Join(
                    _trainerDbContext.Items,
                    transaction => transaction.IdItem,
                    item => item.IdItem,
                    (transaction, item) => new { Transaction = transaction, Item = item }
                )
                .GroupBy(
                    x => x.Transaction.EmailUser,
                    (key, group) => new TotalRevenueDto
                    {
                        TotalRevenue = (float)group.Sum(x => x.Item.Price)
                    }
                )
                .ToListAsync();


            return result;
        }
    }

}
