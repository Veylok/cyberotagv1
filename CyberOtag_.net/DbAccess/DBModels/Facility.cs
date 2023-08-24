using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Facility
{
    public int Facilityid { get; set; }

    public string? Facilityname { get; set; }

    public int Cityid { get; set; }

    public virtual City City { get; set; } = null!;

    public virtual ICollection<Operation> Operations { get; set; } = new List<Operation>();
}
