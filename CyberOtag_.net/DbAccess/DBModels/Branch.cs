using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Branch
{
    public int Branchid { get; set; }

    public string? Branchname { get; set; }

    public virtual ICollection<Graphicset> Graphicsets { get; set; } = new List<Graphicset>();

    public virtual ICollection<Operation> Operations { get; set; } = new List<Operation>();
}
