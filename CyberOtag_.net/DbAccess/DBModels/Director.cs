using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Director
{
    public int Directorid { get; set; }

    public string? Directorname { get; set; }

    public string? Directorsurname { get; set; }

    public virtual ICollection<Operation> Operations { get; set; } = new List<Operation>();
}
