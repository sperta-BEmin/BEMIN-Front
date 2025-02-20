import { createContext, useContext, useState, useEffect } from "react";
import { isLoggedIn  } from "../utils/localUser";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(null);

    useEffect(() => {
        const handleUserChange = () => {
            setLoggedIn(isLoggedIn());
        };

        setLoggedIn(isLoggedIn());

        window.addEventListener("userChanged", handleUserChange);

        return () => {
            window.removeEventListener("userChanged", handleUserChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}