using backend.Model;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
namespace backend.Services
{
    public class JWTService
    {
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _jwtKey;//tym kluczem bedzie mozna zaszyfrowa i odszyfrować JWT
        private readonly IHttpContextAccessor _httpContextAccessor;

        public JWTService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _jwtKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            _httpContextAccessor = httpContextAccessor;
        }
        //tworzenie tokena 
        public string CreateJWT(User user,bool isAdmin)
        {
            //definicja co będzie przechowywał token
            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.GivenName,user.FirstName),
                new Claim(ClaimTypes.Surname,user.LastName)
               // new Claim(ClaimTypes.Role, "User")
            };
            if(isAdmin)
            {
                userClaims.Add(new Claim(ClaimTypes.Role, "Admin"));
            }
            else
            {
                userClaims.Add(new Claim(ClaimTypes.Role, "User"));
            }
            var credentials = new SigningCredentials(_jwtKey, SecurityAlgorithms.HmacSha256Signature);//poświadczenia
            var tokenDecriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(userClaims),
                Expires = DateTime.UtcNow.AddMinutes(15),

/*                Expires = DateTime.UtcNow.AddDays(int.Parse(_configuration["JWT:ExpiresInDays"])),
*/                SigningCredentials = credentials,
                Issuer = _configuration["JWT:Issuer"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();   
            var jwt = tokenHandler.CreateToken(tokenDecriptor);
            var encryptor_token = tokenHandler.WriteToken(jwt);
            var response = _httpContextAccessor.HttpContext.Response;
            response.Cookies.Append("backend_token", encryptor_token,
                    new CookieOptions
                    {
                        Expires = DateTime.UtcNow.AddMinutes(15),
                        HttpOnly=true,
                        Secure = true,
                        IsEssential = true,
                        SameSite = SameSiteMode.Strict
                    });


            return encryptor_token;
        }
        //tworzenie refresh tokena 
        public string CreateRefreshToken(User user)
        {
            var userClaims = new List<Claim>
            {
                new Claim("email",user.Email)
            };

            var creds = new SigningCredentials(_jwtKey, SecurityAlgorithms.HmacSha256);

            var expiration = DateTime.UtcNow.AddHours(24);

            var token = new JwtSecurityToken(
                   claims: userClaims,
                   expires: expiration,
                   signingCredentials: creds
               );

            var handler = new JwtSecurityTokenHandler();
            var encryptor_token=handler.WriteToken(token);
            var response = _httpContextAccessor.HttpContext.Response;
            response.Cookies.Append("backend_refresh_token", encryptor_token,
                    new CookieOptions
                    {
                        Expires = DateTime.UtcNow.AddHours(24),
                        HttpOnly = true,
                        Secure = true,
                        IsEssential = true,
                        SameSite = SameSiteMode.Strict
                    });

            return encryptor_token;

        }
    }
}
