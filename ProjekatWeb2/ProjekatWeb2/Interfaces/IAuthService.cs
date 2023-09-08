using ProjekatWeb2.Dto;

namespace ProjekatWeb2.Interfaces
{
    public interface IAuthService
    {
        Task<GoogleLoginDto> VerifyGoogleToken(ExternalRegister googleToken);
    }
}
