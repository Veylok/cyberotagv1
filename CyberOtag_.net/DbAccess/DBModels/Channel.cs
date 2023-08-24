using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Channel
{
    public int Channelid { get; set; }

    public string? Channelname { get; set; }

    public virtual ICollection<Operation> Operations { get; set; } = new List<Operation>();
}
