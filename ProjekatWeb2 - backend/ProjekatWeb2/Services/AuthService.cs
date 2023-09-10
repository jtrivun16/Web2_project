using Google.Apis.Auth;
using ProjekatWeb2.Dto;
using ProjekatWeb2.Interfaces;

namespace ProjekatWeb2.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _googleSettings;

        public AuthService(IConfiguration config)
        {
            _googleSettings = config.GetSection("GoogleAuthSettings");
        }

        public async Task<GoogleLoginDto> VerifyGoogleToken(ExternalRegister googleToken)
        {
            try
            {
                string token = _googleSettings.GetSection("clientId").Value;
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _googleSettings.GetSection("clientId").Value }
                };
                var socialInfo = await GoogleJsonWebSignature.ValidateAsync(googleToken.IdToken, settings);
                return new GoogleLoginDto()
                {
                    Id = socialInfo.JwtId,
                    Ime = socialInfo.GivenName,
                    Prezime = socialInfo.FamilyName,
                    Email = socialInfo.Email,
                    Slika = socialInfo.Picture

                };

            }
            catch
            {
                return null;
            }
        }
    }
}
