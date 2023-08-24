using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Spending
{
    public int Spendingid { get; set; }

    public int? Operationid { get; set; }

    public int? Spendingtypeid { get; set; }

    public decimal? Spendingamount { get; set; }

    public DateOnly? Spendingdate { get; set; }

    public int? Operatorid { get; set; }

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();

    public virtual Operation? Operation { get; set; }

    public virtual Operator? Operator { get; set; }

    public virtual Spendingtype? Spendingtype { get; set; }
}
