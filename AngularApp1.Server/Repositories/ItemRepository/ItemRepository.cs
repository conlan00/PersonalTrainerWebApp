using backend.Data;
using backend.ModelsTrainer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;

namespace backend.Repositories.ItemRepository
{
    public class ItemRepository : IItemRepository
    {
        private readonly TrainerDbContext _trainerDbContext;

        public ItemRepository(TrainerDbContext trainerDbContext)
        {
            _trainerDbContext = trainerDbContext;
        }
        //zwrocenie Items z bazy
        public async Task<IEnumerable<Item>> GetItems()
        {
            return await _trainerDbContext.Items.ToListAsync();
        }
        public async Task<bool> AddItem(Item newItem)
        {
            
            var isExistingItem = await _trainerDbContext.Items.AnyAsync(i => i.Name == newItem.Name);

            if (!isExistingItem)
            {
                // Dodaj nowy element
                var highestId = await _trainerDbContext.Items.MaxAsync(i => (int?)i.IdItem) ?? 0;

                newItem.IdItem = highestId + 1;
                _trainerDbContext.Items.Add(newItem);

                // Zapisz zmiany
                await _trainerDbContext.SaveChangesAsync();

                return true;
            }
            else
            {
                // Element już istnieje, możesz obsłużyć to odpowiednio
                return false;
            }
        }
        public async Task<bool> DeleteItem(string itemName)
        {
            var isExistingItem = await _trainerDbContext.Items.FirstOrDefaultAsync(i => i.Name == itemName);

            if (isExistingItem!=null)
            {
                _trainerDbContext.Items.Remove(isExistingItem);
                await _trainerDbContext.SaveChangesAsync();
                return true;
            }else
            {
                return false;
            }


        }
    }
}
