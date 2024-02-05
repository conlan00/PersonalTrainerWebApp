using Azure.Core;
using backend.Data;
using backend.DTOs.Account;
using backend.LoginProviders;
using backend.Model;
using backend.Services;
using Google;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly string _googleSettings = "522175460266-os0hfj81g08tetcqhum4sadbdcrdmivt.apps.googleusercontent.com";
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly TrainerDbContext _trainerDbContext;
        public AccountController(JWTService jwtService, SignInManager<User> signInManager
            , UserManager<User> userManager, EmailService emailService, IConfiguration configuration, TrainerDbContext trainerDbContext)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailService = emailService;
            _configuration = configuration;
            _trainerDbContext = trainerDbContext;
        }

        /* [Authorize]
         [HttpGet("refresh-user-token")]
         public async Task<ActionResult<UserDto>> RefreshUserToken()
         {
             var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
             return CreateApplicationUserDto(user);
         }*/

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            bool isAdmin = false;
            if (user != null)
            {
                isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            }

            if (user == null)
            {
                return BadRequest("Zla nazwa uzytkownika lub haslo");
            }
            if (user.EmailConfirmed == false)
            {
                return BadRequest("Prosze potwierdzic email");
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
            {
                return BadRequest("Zla nazwa uzytkownika lub haslo");
            }
            var jwt = CreateApplicationUserDto(user, isAdmin);
            var refreshToken = _jwtService.CreateRefreshToken(user);
            IdentityResult identityResult = await _userManager.SetAuthenticationTokenAsync(user, "Trainer", "RefreshToken", refreshToken);
            return jwt;
        }
        [Authorize(Roles = "User,Admin")]
        [HttpGet("logout")]
        public async Task<bool> logout()
        {
            Response.Cookies.Delete("backend_refresh_token");
            Response.Cookies.Delete("backend_token");
            return true;
        }
        [HttpPost("LoginWithGoogle")]
        public async Task<ActionResult<UserDto>> LoginWithGoogle([FromBody] string credential)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string> { this._googleSettings }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(credential, settings);
            var check = await _userManager.FindByNameAsync(payload.Email);
            if (check == null)
            {
                var UserToAdd = new User
                {
                    FirstName = payload.GivenName.ToLower(),
                    LastName = payload.FamilyName.ToLower(),
                    UserName = payload.Email.ToLower(),
                    Email = payload.Email.ToLower(),
                    EmailConfirmed = payload.EmailVerified
                };
                var result = await _userManager.CreateAsync(UserToAdd);
                var userToBusiness = new backend.ModelsTrainer.User
                {
                    Email = payload.Email.ToLower(),
                    Name = payload.GivenName.ToLower(),
                    Surname = payload.FamilyName.ToLower(),
                };
                //dodanie do logiki
                _trainerDbContext.Users.Add(userToBusiness);
                await _trainerDbContext.SaveChangesAsync();

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
                var refreshToken = _jwtService.CreateRefreshToken(UserToAdd);
                var jwt = CreateApplicationUserDto(UserToAdd, false);
                IdentityResult identityResult = await _userManager.SetAuthenticationTokenAsync(UserToAdd, "Trainer", "RefreshToken", refreshToken);
                await _userManager.AddToRoleAsync(UserToAdd, "User");
                return jwt;
            }
            else
            {
                var UserToGenerate = new User
                {
                    FirstName = payload.GivenName.ToLower(),
                    LastName = payload.FamilyName.ToLower(),
                    UserName = payload.Email.ToLower(),
                    Email = payload.Email.ToLower(),
                    EmailConfirmed = payload.EmailVerified
                };
                var refreshToken = _jwtService.CreateRefreshToken(UserToGenerate);
                var jwt = CreateApplicationUserDto(UserToGenerate, false);
                IdentityResult identityResult = await _userManager.SetAuthenticationTokenAsync(check, "Trainer", "RefreshToken", refreshToken);
                return jwt;
            }
        }
        [HttpDelete("Revoke")]
        public async Task<IActionResult> RevokeToken()
        {
            var request = Request.Cookies["backend_refresh_token"];
            var handler = new JwtSecurityTokenHandler();
            var decode_access = handler.ReadToken(request) as JwtSecurityToken;
            var email = decode_access.Claims.FirstOrDefault(x => x.Type == "email");
            var user = await _userManager.FindByNameAsync(email.Value);
            IdentityResult identityResult = await _userManager.SetAuthenticationTokenAsync(user, "Trainer", "RefreshToken", "");
            return Ok();
        }
        /*     [Authorize(Roles = "User")]
             [HttpGet("zasoby")] 
             public async Task<ActionResult> zasoby()
             {
                 return Ok();
             }*/


        [HttpGet("refresh")]
        public async Task<ActionResult<UserDto>> Refresh()
        {
            var request = Request.Cookies["backend_refresh_token"];
            var handler = new JwtSecurityTokenHandler();
            var decode_access = handler.ReadToken(request) as JwtSecurityToken;
            var email = decode_access.Claims.FirstOrDefault(x => x.Type == "email");
            var user = await _userManager.FindByNameAsync(email.Value);
            bool isAdmin = false;
            if (user != null)
            {
                isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            }
            if (user != null)
            {
                var refresh = await _userManager.GetAuthenticationTokenAsync(user, "Trainer", "RefreshToken");
                if (request == refresh)
                {
                    var jsonToken = handler.ReadToken(refresh) as JwtSecurityToken;
                    var expirationDate = jsonToken.ValidTo;
                    if (DateTime.UtcNow < expirationDate)
                    {

                        //tego nie generuje bo jesli wygasnie to log out poprostu 
                        var refreshToken = _jwtService.CreateRefreshToken(user);
                        IdentityResult identityResult = await _userManager.SetAuthenticationTokenAsync(user, "Trainer", "RefreshToken", refreshToken);
                        CreateApplicationUserDto(user, isAdmin);
                        return Ok();
                    }
                    else
                    {
                        return Unauthorized("Twoj refresh token jest nie wazny ");
                    }
                }
                else
                {
                    return BadRequest("nie zgadza sie token");
                }
            }
            else
            {
                return BadRequest("nie zwrocilo uzytkownika");
            }


        }

        [HttpGet("check_login")]
        public async Task<bool> checkLogin()
        {
            if (Request.Cookies["backend_token"] != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {

            if (await CheckEmailExistAsync(model.Email))
            {
                return BadRequest($"Istniejace konto uzywa {model.Email} adresu e-mail. Prosze sprobowac uzyc inny adres e-mail");
            }
            var userToAdd = new User
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                UserName = model.Email.ToLower(),
                Email = model.Email.ToLower()
            };
            var userToBusiness = new backend.ModelsTrainer.User
            {
                Email = model.Email.ToLower(),
                Name = model.FirstName.ToLower(),
                Surname = model.LastName.ToLower(),
            };
            // dodanie danych do bazy odpowiadajacej za logike 
            _trainerDbContext.Users.Add(userToBusiness);
            await _trainerDbContext.SaveChangesAsync();


            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            await _userManager.AddToRoleAsync(userToAdd, "User");
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            try
            {
                if (await SendConfirmEmailAsync(userToAdd))
                {
                    return Ok(new JsonResult(new { tittle = "Account Created", message = "Twoje konto zostalo utworzone, powierdz email adress" }));
                }
                return BadRequest("blad wysylania maila");

            }
            catch (Exception)
            {

                return BadRequest("blad wysylania maila");
            }
        }
        [HttpPut("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Email jeszcze nie zarejestrowany");
            }
            if (user.EmailConfirmed == true)
            {
                return BadRequest("Email zostal juz wczesniej potwierdzony");
            }
            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
                if (result.Succeeded)
                {
                    return Ok(new JsonResult(new { tittle = "Email Potwierdzony", message = "Twoj email jest potwierdzonych. Możesz sie zalogowac" }));
                }
                return BadRequest("Zly token. Sprobuj ponownie");
            }
            catch (Exception)
            {
                return BadRequest("Zly token. Sprobuj ponownie");
            }
        }

        [HttpPost("resend-email-confirmation-link/{email}")]
        public async Task<IActionResult> ResendEmailConfirmationLink(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("zly email");
            }
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("Ten adres email nie zostal jeszcze zarejestrowany");
            }
            if (user.EmailConfirmed == true)
            {
                return BadRequest("Twoj adres email zostal juz potwierdzony. Zaloguj sie na swoje konto");
            }
            try
            {
                if (await SendConfirmEmailAsync(user))
                {
                    return Ok(new JsonResult(new { tittle = "Potwierdzenie wyslania linka", message = " potwierdz email adress" }));

                }
                return BadRequest("Blad wyslania email");
            }
            catch (Exception)
            {
                return BadRequest("Blad wyslania email");

            }
        }

        [HttpPost("forgot-username-or-password/{email}")]
        public async Task<IActionResult> ForgotUsernameOrPassword(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("zly email");
            }
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("Ten adres email nie zostal jeszcze zarejestrowany");
            }
            if (user.EmailConfirmed == false)
            {
                return BadRequest("Prosze potwierdzic najpierw adres email");
            }
            try
            {
                if (await SendForgotUsernameOrPasswordEmail(user))
                {
                    return Ok(new JsonResult(new { tittle = "Zapomniana nazwa uzytkownika lub haslo wyslanie maila", message = "Sprawdz swoj email" }));
                }
                return BadRequest("Blad wyslaniea emaila");
            }
            catch (Exception)
            {
                return BadRequest("Blad wyslaniea emaila");

            }
        }

        [HttpPut("reset-password")]
        public async Task<ActionResult<string>> ResetPassword(ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Ten adres email nie zostal jeszcze zarejestrowany");
            }
            if (user.EmailConfirmed == false)
            {
                return BadRequest("Prosze potwierdzic najpierw adres email");
            }
            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);
                if (result.Succeeded)
                {
                    return Ok(new JsonResult(new { tittle = "Haslo zresetowane pomyslnie", message = "Twoje haslo zostalo zresetowane" }));
                }
                return BadRequest("Zly token. Sprobuj ponownie");
            }
            catch (Exception)
            {
                return BadRequest("Zly token. Sprobuj ponownie");

            }
        }
        [Authorize]
        [HttpGet("GetRole")]
        public async Task<ActionResult<string>> GetRole()
        {
            var request = Request.Cookies["backend_refresh_token"];
            var handler = new JwtSecurityTokenHandler();
            var decode_access = handler.ReadToken(request) as JwtSecurityToken;
            var email = decode_access.Claims.FirstOrDefault(x => x.Type == "email");
            var user = await _userManager.FindByNameAsync(email.Value);
            if (user != null)
            {
                var refresh = await _userManager.GetAuthenticationTokenAsync(user, "Trainer", "RefreshToken");
                if (request == refresh)
                {
                    var request1 = Request.Cookies["backend_token"];
                    var handler1 = new JwtSecurityTokenHandler();
                    var decode_access1 = handler1.ReadToken(request1) as JwtSecurityToken;
                    var role = decode_access1.Claims.FirstOrDefault(x => x.Type == "role");
                    return Ok(new JsonResult(new { rola = role.Value }));
                }
                return BadRequest();
            }
            return BadRequest();
        }
        #region Private Helper Methods
        private UserDto CreateApplicationUserDto(User user, bool isAdmin)
        {
            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                JWT = _jwtService.CreateJWT(user, isAdmin),
            };
        }
        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }
        private async Task<bool> SendConfirmEmailAsync(User user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_configuration["JWT:ClientUrl"]}/{_configuration["Email:ConfirmEmailPath"]}?token={token}&email={user.Email}";

            var body = $"<p>Czesc: {user.FirstName} {user.LastName}</p>" +
                "<p> Prosze potwierdzic adres emaila klikajac w ponizszy link.</p>" +
                $"<p><a href=\"{url}\"> Kliknij tutaj</a></p>" +
                "<p>Dziekuje, </p>" +
                $"<br>{_configuration["Email:ApplicationName"]}";

            var emailSend = new EmailSendDto(user.Email, "Potwierdz swoj email", body);

            return await _emailService.SendEmailAsync(emailSend);
        }
        private async Task<bool> SendForgotUsernameOrPasswordEmail(User user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_configuration["JWT:ClientUrl"]}/{_configuration["Email:ResetPasswordPath"]}?token={token}&email={user.Email}";

            var body = $"<p>Czesc: {user.FirstName} {user.LastName}</p>" +
                $"<p> Nazwa uzytkownika: {user.UserName} </p>" +
                "<p>Kliknij w ponizszy link aby zresetowac haslo</p>" +
                $"<p><a href=\"{url}\"> Kliknij tutaj</a></p>" +
                "<p>Dziekuje, </p>" +
                $"<br>{_configuration["Email:ApplicationName"]}";
            var emailSend = new EmailSendDto(user.Email, "Zapomniane haslo lub nazwa uzytkownika", body);

            return await _emailService.SendEmailAsync(emailSend);
        }
        #endregion
    }
}