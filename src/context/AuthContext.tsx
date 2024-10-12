"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  token: null,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (token: string) => {
    setToken(token);
    Cookies.set("token", token, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });
  };

  const logout = () => {
    setToken(null);
    Cookies.remove("token");
    toast({ description: "Logged Out", variant: "destructive" });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
