import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded = jwtDecode(token);

                return {
                    token,
                    id:
                        decoded.nameid ||
                        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                    name:
                        decoded.unique_name ||
                        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                    role:
                        decoded.role ||
                        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                };
            } catch {
                localStorage.removeItem("token");
            }
        }
        return null;
    });

    const login = (token) => {
        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);

        setUser({
            token,
            id:
                decoded.nameid ||
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            name:
                decoded.unique_name ||
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            role:
                decoded.role ||
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);