using System;
using System.Collections.Generic;

namespace DbAccess.DBModels;

public partial class User
{
    public int Userid { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int Roleid { get; set; }

    public virtual ICollection<Refreshtoken> Refreshtokens { get; set; } = new List<Refreshtoken>();

    public virtual Role? Role { get; set; }
}
