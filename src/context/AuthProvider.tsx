// ** React
import {
  SetStateAction,
  Dispatch,
  createContext,
  useState,
  useEffect,
} from "react";

// ** Components
import LoadingScreen from "@/components/layouts/LoadingScreen";

// ** Library
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate, Outlet } from "react-router-dom";

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
  const isLoginPage = window.location.pathname.includes("/login");
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, _setLoading] = useState(false);

  const { mutate, isPending } = useMutation<
    User,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => signIn(username, password),
    onSuccess: (data) => {
      const { token } = data;
      localStorage.setItem("accessToken", token);
      const returnUrl = searchParams.get("returnUrl");
      setUser({ test: "not empty" });
      const redirectUrl = returnUrl ? returnUrl : "/";
      navigate(redirectUrl);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  useEffect(() => {
    // const token = localStorage.getItem("accessToken");
    // const initAuth = async () => {
    //   if (token) {
    //     try {
    //       setLoading(true);
    //       const userData = await getUserInfo();
    //       setUser(userData);
    //     } catch (error) {
    //       localStorage.removeItem("accessToken");
    //       localStorage.removeItem("refreshToken");
    //       setUser(null);
    //     } finally {
    //       setLoading(false);
    //     }
    //   }
    // };
    // initAuth();
  }, []);

  function handleLogin({ username, password }: LoginCredentials) {
    if (username && password) {
      mutate({ username, password });
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  };

  if (!isLoginPage) {
    if (isLoading || isPending) {
      return <LoadingScreen />;
    }
  }

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
