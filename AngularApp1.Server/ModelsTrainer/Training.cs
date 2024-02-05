using System;
using System.Collections.Generic;

namespace backend.ModelsTrainer;

public partial class Training
{
    public decimal IdTraining { get; set; }

    public byte DayOfWeek { get; set; }

    public decimal IdExercise { get; set; }

    public decimal IdTransaction { get; set; }

    public virtual Exercise IdExerciseNavigation { get; set; } = null!;

    public virtual Transaction IdTransactionNavigation { get; set; } = null!;
}
