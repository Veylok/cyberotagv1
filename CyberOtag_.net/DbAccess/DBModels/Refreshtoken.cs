using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class Refreshtoken
{
    public int Userid { get; set; }

    public string Token { get; set; } = null!;

    public DateTime Expirydatetime { get; set; }

    public virtual User User { get; set; } = null!;
}
