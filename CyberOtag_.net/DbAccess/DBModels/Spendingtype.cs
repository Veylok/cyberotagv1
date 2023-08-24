using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Spendingtype
{
    public int Spendingtypeid { get; set; }

    public string? Spendingtypename { get; set; }

    public virtual ICollection<Spending> Spendings { get; set; } = new List<Spending>();
}
