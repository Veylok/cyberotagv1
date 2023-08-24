using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Document
{
    public int Documentid { get; set; }

    public int? Spendingid { get; set; }

    public byte[]? Documentimg { get; set; }

    public virtual Spending? Spending { get; set; }
}
