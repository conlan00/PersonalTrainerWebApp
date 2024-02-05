using System;
using System.Collections.Generic;

namespace backend.ModelsTrainer;

public partial class Transaction
{
    public decimal IdTransaction { get; set; }

    public bool IsPaid { get; set; }

    public decimal? IdItem { get; set; }

    public string? EmailUser { get; set; }
    public DateTimeOffset DateOfTransaction { get; set; }

    public virtual User? EmailUserNavigation { get; set; }

    public virtual Item? IdItemNavigation { get; set; }

    public virtual ICollection<Training> Training { get; set; } = new List<Training>();
}
