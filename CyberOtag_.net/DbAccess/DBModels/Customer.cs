using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Customer
{
    public int Customerid { get; set; }

    public string? Customername { get; set; }

    public virtual ICollection<Operation> Operations { get; set; } = new List<Operation>();
}
