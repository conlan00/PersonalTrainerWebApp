using System;
using System.Collections.Generic;

namespace backend.ModelsTrainer;

public partial class Item
{
    public decimal IdItem { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public int Days { get; set; }

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
