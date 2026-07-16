

using Authorization.DTOs;

namespace Authorization.IServices
{
    public interface IAuthService
    {
        Task<Tuple<int, TokenDto>> loginUser(UserLoginDto userDto);
        Task<Tuple<int, string>> RegisterUser(UserDto userDto);
        Task<Tuple<List<UserDto>, string>> GetAllUsers();
        Task<Tuple<UserDto, string>> GetUserById(Guid id);
        Task<Tuple<int, string>> UpdateUser(UserDto userDto);
        Task<Tuple<int, string>> DeleteUser(Guid id);
       

    }
}
