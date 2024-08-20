// ** React
import {
  SetStateAction,
  Dispatch,
  createContext,
  useState,
  useEffect,
} from "react";

// ** Library
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Outlet } from "react-router-dom";

// ** Services
import { signIn } from "@/services/authService";

// ** Types
import { LoginCredentials, User } from "@/types/User";

export interface IAuthContext {
  user: User | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => void;
  login: ({ username, password }: LoginCredentials) => void;
}

// ** Create Context
export const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(false);

  const { mutate, isPending } = useMutation<
    User,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => signIn(username, password),
    onSuccess: (data) => {
      setUser(data);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    const initAuth = async () => {
      if (token) {
        try {
          setLoading(true);
          // const userData = await getUserInfo();
          // setUser(userData);
        } catch (error) {
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  function handleLogin({ username, password }: LoginCredentials) {
    if (username && password) {
      mutate({ username, password });
    }
  }

  const handleLogout = () => {
    setUser(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: handleLogin,
        logout: handleLogout,
        isLoading: isLoading || isPending,
      }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
