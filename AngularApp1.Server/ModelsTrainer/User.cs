using System;
using System.Collections.Generic;

namespace backend.ModelsTrainer;

public partial class User
{
    public string Email { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Surname { get; set; } = null!;

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
