

using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IAuthService
    {
        Task<Tuple<int, TokenDto>> loginUser(UserDto userDto);
        Task<Tuple<int, string>> RegisterUser(UserDto userDto);
       

    }
}
