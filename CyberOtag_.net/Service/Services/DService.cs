using DbAccess.DBModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;



namespace Service.Services
{
    public class DService
    {
        private readonly IConfiguration _configuration;
        private readonly TaslakContext _dbContext;

        public DService(IConfiguration configuration, TaslakContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }
        //AssignmentService
        public List<Assignment> GetAllAssignments()
        {
            return _dbContext.Assignments.ToList();
        }

        public Assignment GetAssignmentById(int assignmentId)
        {
            return _dbContext.Assignments.FirstOrDefault(a => a.Assignmentid == assignmentId);
        }

        public void AddAssignment(Assignment assignment)
        {
            _dbContext.Assignments.Add(assignment);
            _dbContext.SaveChanges();
        }

        public void UpdateAssignment(Assignment updatedAssignment)
        {
            var existingAssignment = _dbContext.Assignments.FirstOrDefault(a => a.Assignmentid == updatedAssignment.Assignmentid);
            if (existingAssignment != null)
            {
                existingAssignment.Operationid = updatedAssignment.Operationid;
                existingAssignment.Operatorid = updatedAssignment.Operatorid;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteAssignment(int assignmentId)
        {
            var assignmentToDelete = _dbContext.Assignments.FirstOrDefault(a => a.Assignmentid == assignmentId);
            if (assignmentToDelete != null)
            {
                _dbContext.Assignments.Remove(assignmentToDelete);
                _dbContext.SaveChanges();
            }
        }
        //AuthService
        public async Task<string> Login(string username, string password)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);

                if (user == null || user.Password != password)
                {
                    throw new SecurityTokenException("Geçersiz kullanıcı adı veya şifre");
                }

                var accessToken = GenerateAccessToken(user);
                var refreshToken = GenerateRefreshToken();
                await SaveRefreshToken(user.Userid, refreshToken);

                return accessToken;
            }
            catch (SecurityTokenException ex)
            {

                throw;
            }
            catch (Exception ex)
            {

                throw new Exception("Giriş işlemi sırasında bir hata oluştu.", ex);
            }
        }


        private async Task<string> GetUserRoleName(int roleId)
        {
            var role = await _dbContext.Roles.FindAsync(roleId);
            return role?.Rolename ?? "User";
        }

        public string GenerateAccessToken(User user)
        {
            var roleName = GetUserRoleName(user.Roleid).Result;
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, roleName),

            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public async Task SaveRefreshToken(int userId, string refreshToken)
        {
            var expiryDateTime = DateTime.UtcNow.AddDays(7);
            var refreshTokenEntry = new Refreshtoken
            {
                Userid = userId,
                Token = refreshToken,
                Expirydatetime = expiryDateTime
            };

            _dbContext.Refreshtokens.Add(refreshTokenEntry);
            await _dbContext.SaveChangesAsync();
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = true
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
            return principal;
        }

        public async Task<string> RefreshAccessToken(string refreshToken)
        {
            var principal = GetPrincipalFromExpiredToken(refreshToken);

            if (principal == null || !principal.HasClaim(c => c.Type == ClaimTypes.Name))
            {
                throw new SecurityTokenException("Geçersiz token");
            }

            var expirationDateUnix = long.Parse(principal.Claims.Single(c => c.Type == JwtRegisteredClaimNames.Exp).Value);
            var expirationDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(expirationDateUnix);

            if (expirationDateTimeUtc > DateTime.UtcNow)
            {
                throw new SecurityTokenException("Token süresi dolmuş");
            }

            var username = principal.Identity.Name;


            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                throw new SecurityTokenException("Kullanıcı bulunamadı");
            }

            return GenerateAccessToken(user);
        }
        // BranchService
        public List<Branch> GetAllBranches()
        {
            return _dbContext.Branches.ToList();
        }

        public Branch GetBranchById(int branchId)
        {
            return _dbContext.Branches.FirstOrDefault(b => b.Branchid == branchId);
        }

        public void AddBranch(Branch branch)
        {
            _dbContext.Branches.Add(branch);
            _dbContext.SaveChanges();
        }

        public void UpdateBranch(Branch updatedBranch)
        {
            var existingBranch = _dbContext.Branches.FirstOrDefault(b => b.Branchid == updatedBranch.Branchid);
            if (existingBranch != null)
            {
                existingBranch.Branchname = updatedBranch.Branchname;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteBranch(int branchId)
        {
            var branchToDelete = _dbContext.Branches.FirstOrDefault(b => b.Branchid == branchId);
            if (branchToDelete != null)
            {
                _dbContext.Branches.Remove(branchToDelete);
                _dbContext.SaveChanges();
            }
        }
        //ChannelService

        public List<Channel> GetAllChannels()
        {
            return _dbContext.Channels.ToList();
        }

        public Channel GetChannelById(int channelId)
        {
            return _dbContext.Channels.FirstOrDefault(c => c.Channelid == channelId);
        }

        public void AddChannel(Channel channel)
        {
            _dbContext.Channels.Add(channel);
            _dbContext.SaveChanges();
        }

        public void UpdateChannel(Channel updatedChannel)
        {
            var existingChannel = _dbContext.Channels.FirstOrDefault(c => c.Channelid == updatedChannel.Channelid);
            if (existingChannel != null)
            {
                existingChannel.Channelname = updatedChannel.Channelname;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteChannel(int channelId)
        {
            var channelToDelete = _dbContext.Channels.FirstOrDefault(c => c.Channelid == channelId);
            if (channelToDelete != null)
            {
                _dbContext.Channels.Remove(channelToDelete);
                _dbContext.SaveChanges();
            }
        }
        //CityService
        public List<City> GetAllCities()
        {
            return _dbContext.Cities.ToList();
        }

        public City GetCityById(int cityId)
        {
            return _dbContext.Cities.FirstOrDefault(c => c.Cityid == cityId);
        }

        public void AddCity(City city)
        {
            _dbContext.Cities.Add(city);
            _dbContext.SaveChanges();
        }

        public void UpdateCity(City updatedCity)
        {
            var existingCity = _dbContext.Cities.FirstOrDefault(c => c.Cityid == updatedCity.Cityid);
            if (existingCity != null)
            {
                existingCity.Cityname = updatedCity.Cityname;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteCity(int cityId)
        {
            var cityToDelete = _dbContext.Cities.FirstOrDefault(c => c.Cityid == cityId);
            if (cityToDelete != null)
            {
                _dbContext.Cities.Remove(cityToDelete);
                _dbContext.SaveChanges();
            }
        }
        //CustomerService
        public List<Customer> GetAllCustomers()
        {
            return _dbContext.Customers.ToList();
        }

        public Customer GetCustomerById(int customerId)
        {
            return _dbContext.Customers.FirstOrDefault(c => c.Customerid == customerId);
        }

        public void AddCustomer(Customer customer)
        {
            _dbContext.Customers.Add(customer);
            _dbContext.SaveChanges();
        }

        public void UpdateCustomer(Customer updatedCustomer)
        {
            var existingCustomer = _dbContext.Customers.FirstOrDefault(c => c.Customerid == updatedCustomer.Customerid);
            if (existingCustomer != null)
            {
                existingCustomer.Customername = updatedCustomer.Customername;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteCustomer(int customerId)
        {
            var customerToDelete = _dbContext.Customers.FirstOrDefault(c => c.Customerid == customerId);
            if (customerToDelete != null)
            {
                _dbContext.Customers.Remove(customerToDelete);
                _dbContext.SaveChanges();
            }
        }
        //DirectorService
        public List<Director> GetAllDirectors()
        {
            return _dbContext.Directors.ToList();
        }

        public Director GetDirectorById(int directorId)
        {
            return _dbContext.Directors.FirstOrDefault(d => d.Directorid == directorId);
        }

        public void AddDirector(Director director)
        {
            _dbContext.Directors.Add(director);
            _dbContext.SaveChanges();
        }

        public void UpdateDirector(Director updatedDirector)
        {
            var existingDirector = _dbContext.Directors.FirstOrDefault(d => d.Directorid == updatedDirector.Directorid);
            if (existingDirector != null)
            {
                existingDirector.Directorname = updatedDirector.Directorname;
                existingDirector.Directorsurname = updatedDirector.Directorsurname;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteDirector(int directorId)
        {
            var directorToDelete = _dbContext.Directors.FirstOrDefault(d => d.Directorid == directorId);
            if (directorToDelete != null)
            {
                _dbContext.Directors.Remove(directorToDelete);
                _dbContext.SaveChanges();
            }
        }
        //Document Service
        public List<Document> GetAllDocuments()
        {
            return _dbContext.Documents.ToList();
        }

        public Document GetDocumentById(int documentId)
        {
            return _dbContext.Documents.FirstOrDefault(d => d.Documentid == documentId);
        }

        public void AddDocument(Document document)
        {
            _dbContext.Documents.Add(document);
            _dbContext.SaveChanges();
        }

        public void UpdateDocument(Document updatedDocument)
        {
            var existingDocument = _dbContext.Documents.FirstOrDefault(d => d.Documentid == updatedDocument.Documentid);
            if (existingDocument != null)
            {
                existingDocument.Spendingid = updatedDocument.Spendingid;
                existingDocument.Documentimg = updatedDocument.Documentimg;
                _dbContext.SaveChanges();
            }
        }

        public void DeleteDocument(int documentId)
        {
            var documentToDelete = _dbContext.Documents.FirstOrDefault(d => d.Documentid == documentId);
            if (documentToDelete != null)
            {
                _dbContext.Documents.Remove(documentToDelete);
                _dbContext.SaveChanges();
            }
        }
        // FacilityService
        public List<Facility> GetAllFacilities()
        {
            return _dbContext.Facilities.ToList();
        }

        public List<Facility> GetAllFacilitiesWithCityNames()
        {
            return _dbContext.Facilities.Include(f => f.City).ToList();
        }

        public Facility GetFacilityById(int facilityId)
        {
            return _dbContext.Facilities.FirstOrDefault(f => f.Facilityid == facilityId);
        }

        public void AddFacility(Facility facility)
        {
            _dbContext.Facilities.Add(facility);
            _dbContext.SaveChanges();
        }

        public void UpdateFacility(Facility updatedFacility)
        {
            var existingFacility = _dbContext.Facilities.FirstOrDefault(f => f.Facilityid == updatedFacility.Facilityid);
            if (existingFacility != null)
            {
                existingFacility.Facilityname = updatedFacility.Facilityname;
                existingFacility.Cityid = updatedFacility.Cityid;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteFacility(int facilityId)
        {
            var facilityToDelete = _dbContext.Facilities.FirstOrDefault(f => f.Facilityid == facilityId);
            if (facilityToDelete != null)
            {
                _dbContext.Facilities.Remove(facilityToDelete);
                _dbContext.SaveChanges();
            }
        }

        public List<Facility> GetFacilitiesByCity(int cityId)
        {
            return _dbContext.Facilities.Where(f => f.Cityid == cityId).ToList();
        }
        //GraphicsetService
        public List<Graphicset> GetAllGraphicsetsWithBranchNames()
        {
            return _dbContext.Graphicsets.Include(g => g.Branch).ToList();
        }
        public List<Graphicset> GetAllGraphicset()
        {
            return _dbContext.Graphicsets.ToList();
        }
        public List<Graphicset> GetGraphicsetsByBranchId(int branchId)
        {
            return _dbContext.Graphicsets.Where(g => g.Branchid == branchId).ToList();
        }

        public Graphicset GetGraphicsetById(int graphicsetId)
        {
            return _dbContext.Graphicsets.Include(g => g.Branch).FirstOrDefault(g => g.Graphicsetid == graphicsetId);
        }

        public void AddGraphicset(Graphicset graphicsetToAdd)
        {
            _dbContext.Graphicsets.Add(graphicsetToAdd);
            _dbContext.SaveChanges();
        }

        public void UpdateGraphicset(Graphicset updatedGraphicset)
        {
            _dbContext.Graphicsets.Update(updatedGraphicset);
            _dbContext.SaveChanges();
        }

        public void DeleteGraphicset(int graphicsetId)
        {
            var graphicsetToDelete = _dbContext.Graphicsets.Find(graphicsetId);
            if (graphicsetToDelete != null)
            {
                _dbContext.Graphicsets.Remove(graphicsetToDelete);
                _dbContext.SaveChanges();
            }
        }
        //OperationService
        public List<Operation> GetAllOperations()
        {
            return _dbContext.Operations.ToList();
        }

        public Operation GetOperationById(int operationId)
        {
            return _dbContext.Operations.FirstOrDefault(o => o.Operationid == operationId);
        }

        public void AddOperation(Operation operation)
        {
            _dbContext.Operations.Add(operation);
            _dbContext.SaveChanges();
        }

        public void UpdateOperation(Operation updatedOperation)
        {
            var existingOperation = _dbContext.Operations.FirstOrDefault(o => o.Operationid == updatedOperation.Operationid);
            if (existingOperation != null)
            {
                existingOperation.Date = updatedOperation.Date;
                existingOperation.Startingtime = updatedOperation.Startingtime;
                existingOperation.Endingtime = updatedOperation.Endingtime;
                existingOperation.Branchid = updatedOperation.Branchid;
                existingOperation.Cityid = updatedOperation.Cityid;
                existingOperation.Customerid = updatedOperation.Customerid;
                existingOperation.Channelid = updatedOperation.Channelid;
                existingOperation.Directorid = updatedOperation.Directorid;
                existingOperation.Graphicsetid = updatedOperation.Graphicsetid;
                existingOperation.Facilityid = updatedOperation.Facilityid;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteOperation(int operationId)
        {
            var operationToDelete = _dbContext.Operations.FirstOrDefault(o => o.Operationid == operationId);
            if (operationToDelete != null)
            {
                _dbContext.Operations.Remove(operationToDelete);
                _dbContext.SaveChanges();
            }
        }
        //OperatorService

        public void Ekle(Operator operatorToAdd)
        {
            _dbContext.Operators.Add(operatorToAdd);
            _dbContext.SaveChanges();
        }

        public void Sil(int operatorId)
        {
            Operator operatorToDelete = _dbContext.Operators.Find(operatorId);
            if (operatorToDelete != null)
            {
                _dbContext.Operators.Remove(operatorToDelete);
                _dbContext.SaveChanges();
            }
        }

        public void Guncelle(Operator updatedOperator)
        {
            Operator operatorToUpdate = _dbContext.Operators.Find(updatedOperator.Operatorid);
            if (operatorToUpdate != null)
            {
                operatorToUpdate.Operatorname = updatedOperator.Operatorname;
                operatorToUpdate.Operatorsurname = updatedOperator.Operatorsurname;
                operatorToUpdate.Operatorphonenumber = updatedOperator.Operatorphonenumber;
                _dbContext.SaveChanges();
            }
        }

        public Operator Getir(int operatorId)
        {
            return _dbContext.Operators.Find(operatorId);
        }

        public List<Operator> TumOperatorleriGetir()
        {
            return _dbContext.Operators.ToList();
        }
        //RoleService
        public async Task<List<Role>> GetAllRolesAsync()
        {
            return await _dbContext.Roles.ToListAsync();
        }

        public async Task<Role> GetRoleByIdAsync(int id)
        {
            return await _dbContext.Roles.FindAsync(id);
        }

        public async Task<Role> CreateRoleAsync(Role role)
        {
            _dbContext.Roles.Add(role);
            await _dbContext.SaveChangesAsync();
            return role;
        }

        public async Task<bool> UpdateRoleAsync(int id, Role role)
        {
            if (id != role.Roleid)
            {
                return false;
            }

            _dbContext.Entry(role).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var role = await _dbContext.Roles.FindAsync(id);

            if (role == null)
            {
                return false;
            }

            _dbContext.Roles.Remove(role);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        private bool RoleExists(int id)
        {
            return _dbContext.Roles.Any(r => r.Roleid == id);
        }
        // SpendingService
        public List<Spending> GetAllSpendings()
        {
            return _dbContext.Spendings.ToList();
        }

        public Spending GetSpendingById(int spendingId)
        {
            return _dbContext.Spendings.FirstOrDefault(s => s.Spendingid == spendingId);
        }

        public void AddSpending(Spending spending)
        {
            _dbContext.Spendings.Add(spending);
            _dbContext.SaveChanges();
        }

        public void UpdateSpending(Spending updatedSpending)
        {
            var existingSpending = _dbContext.Spendings.FirstOrDefault(s => s.Spendingid == updatedSpending.Spendingid);
            if (existingSpending != null)
            {
                existingSpending.Operationid = updatedSpending.Operationid;
                existingSpending.Spendingtypeid = updatedSpending.Spendingtypeid;
                existingSpending.Spendingamount = updatedSpending.Spendingamount;
                existingSpending.Spendingdate = updatedSpending.Spendingdate;
                existingSpending.Operatorid = updatedSpending.Operatorid;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteSpending(int spendingId)
        {
            var spendingToDelete = _dbContext.Spendings.FirstOrDefault(s => s.Spendingid == spendingId);
            if (spendingToDelete != null)
            {
                _dbContext.Spendings.Remove(spendingToDelete);
                _dbContext.SaveChanges();
            }
        }
        //SpendingTypeService
        public List<Spendingtype> GetAllSpendingtypes()
        {
            return _dbContext.Spendingtypes.ToList();
        }

        public Spendingtype GetSpendingtypeById(int spendingtypeId)
        {
            return _dbContext.Spendingtypes.FirstOrDefault(s => s.Spendingtypeid == spendingtypeId);
        }

        public void AddSpendingtype(Spendingtype spendingtype)
        {
            _dbContext.Spendingtypes.Add(spendingtype);
            _dbContext.SaveChanges();
        }

        public void UpdateSpendingtype(Spendingtype updatedSpendingtype)
        {
            var existingSpendingtype = _dbContext.Spendingtypes.FirstOrDefault(s => s.Spendingtypeid == updatedSpendingtype.Spendingtypeid);
            if (existingSpendingtype != null)
            {
                existingSpendingtype.Spendingtypename = updatedSpendingtype.Spendingtypename;

                _dbContext.SaveChanges();
            }
        }

        public void DeleteSpendingtype(int spendingtypeId)
        {
            var spendingtypeToDelete = _dbContext.Spendingtypes.FirstOrDefault(s => s.Spendingtypeid == spendingtypeId);
            if (spendingtypeToDelete != null)
            {
                _dbContext.Spendingtypes.Remove(spendingtypeToDelete);
                _dbContext.SaveChanges();
            }
        }
        //UserService
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _dbContext.Users.ToListAsync();
        }
        public async Task<User> GetUserByUsername(string username)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);
        }
        public async Task<Role> GetUserRoleByIdAsync(int roleId)
        {
            return await _dbContext.Roles.FirstOrDefaultAsync(r => r.Roleid == roleId);
        }
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _dbContext.Users.FindAsync(id);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<bool> UpdateUserAsync(int id, User user)
        {
            if (id != user.Userid)
            {
                return false;
            }

            _dbContext.Entry(user).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _dbContext.Users.FindAsync(id);

            if (user == null)
            {
                return false;
            }

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        private bool UserExists(int id)
        {
            return _dbContext.Users.Any(u => u.Userid == id);
        }
        // Transaction Handling
        // Spending+Document ile kullanılabilir
        //----------------------------------------
        //deneme UpdateSpendingWithTransaction
        public void UpdateSpendingWithTransaction(Spending updatedSpending)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingSpending = _dbContext.Spendings.FirstOrDefault(s => s.Spendingid == updatedSpending.Spendingid);

                    if (existingSpending != null)
                    {
                        existingSpending.Operationid = updatedSpending.Operationid;
                        existingSpending.Spendingtypeid = updatedSpending.Spendingtypeid;
                        existingSpending.Spendingamount = updatedSpending.Spendingamount;
                        existingSpending.Spendingdate = updatedSpending.Spendingdate;
                        existingSpending.Operatorid = updatedSpending.Operatorid;

                        _dbContext.SaveChanges();
                    }

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
            }
        }

    }

}

