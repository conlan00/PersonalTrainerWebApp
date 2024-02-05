using backend.ModelsTrainer;

namespace backend.Repositories.ItemRepository
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetItems();
        Task<bool> AddItem(Item newItem);
        Task<bool> DeleteItem(string itemName);
    }
}
