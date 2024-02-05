using System;
using System.Collections.Generic;

namespace backend.ModelsTrainer;

public partial class Exercise
{
    public decimal IdExercise { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Training> Training { get; set; } = new List<Training>();
}
