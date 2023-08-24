using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Service.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DService _authService;

        public AuthController(DService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                var accessToken = await _authService.Login(model.Username, model.Password);
                return Ok(new { AccessToken = accessToken });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = "Giriş işlemi sırasında bir hata oluştu." });
            }
        }

        public class LoginModel
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }



        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(string refreshToken)
        {
            try
            {
                var newAccessToken = await _authService.RefreshAccessToken(refreshToken);
                return Ok(new { AccessToken = newAccessToken });
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
