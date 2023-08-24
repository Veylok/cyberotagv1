using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Operation
{
    public int Operationid { get; set; }

    public DateOnly? Date { get; set; }

    public TimeOnly? Startingtime { get; set; }

    public TimeOnly? Endingtime { get; set; }

    public int? Branchid { get; set; }

    public int? Cityid { get; set; }

    public int? Customerid { get; set; }

    public int? Channelid { get; set; }

    public int? Directorid { get; set; }

    public int? Graphicsetid { get; set; }

    public int? Facilityid { get; set; }

    public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();

    public virtual Branch? Branch { get; set; }

    public virtual Channel? Channel { get; set; }

    public virtual City? City { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual Director? Director { get; set; }

    public virtual Facility? Facility { get; set; }

    public virtual Graphicset? Graphicset { get; set; }

    public virtual ICollection<Spending> Spendings { get; set; } = new List<Spending>();
}
