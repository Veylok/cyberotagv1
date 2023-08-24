using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Operator
{
    public int Operatorid { get; set; }

    public string? Operatorname { get; set; }

    public string? Operatorsurname { get; set; }

    public long? Operatorphonenumber { get; set; }

    public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();

    public virtual ICollection<Spending> Spendings { get; set; } = new List<Spending>();
}
