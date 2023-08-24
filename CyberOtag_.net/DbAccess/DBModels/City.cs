using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class City
{
    public int Cityid { get; set; }

    public string? Cityname { get; set; }

    public virtual ICollection<Facility> Facilities { get; set; } = new List<Facility>();

    public virtual ICollection<Operation> Operations { get; set; } = new List<Operation>();
}
