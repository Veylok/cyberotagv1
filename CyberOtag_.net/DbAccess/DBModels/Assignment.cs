using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Assignment
{
    public int Assignmentid { get; set; }

    public int? Operationid { get; set; }

    public int? Operatorid { get; set; }

    public virtual Operation? Operation { get; set; }

    public virtual Operator? Operator { get; set; }
}
