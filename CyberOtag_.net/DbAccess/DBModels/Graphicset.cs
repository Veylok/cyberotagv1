using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Graphicset
{
    public int Graphicsetid { get; set; }

    public string? Graphicsetname { get; set; }

    public int? Branchid { get; set; }

    public virtual Branch? Branch { get; set; }

    public virtual ICollection<Operation> Operations { get; set; } = new List<Operation>();
}
