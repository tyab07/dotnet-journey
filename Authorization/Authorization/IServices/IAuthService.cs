

using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IAuthService
    {
        Task<Tuple<int, string?>> loginUser(UserDto userDto);
        Task<Tuple<int, string>> RegisterUser(UserDto userDto);
       

    }
}
