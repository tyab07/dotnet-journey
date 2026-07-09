

using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IAuthService
    {
        Task<Tuple<int, TokenDto>> loginUser(UserLoginDto userDto);
        Task<Tuple<int, string>> RegisterUser(UserDto userDto);
       

    }
}
