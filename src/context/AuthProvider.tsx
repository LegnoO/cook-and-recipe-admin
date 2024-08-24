// ** React
import {
  SetStateAction,
  Dispatch,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ** Library
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";

// ** Services
import { getUserInfo, signIn } from "@/services/authService";

// // ** Utils
// import { isUrlMatching } from "@/utils/url";

// // ** Config
// import { ALL_URL } from "@/config/route-permission";

// ** Types
import { LoginCredentials, User, AuthTokens } from "@/types/Auth";
import { AxiosError } from "axios";

export interface IAuthContext {
  user: User | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  login: ({ username, password }: LoginCredentials) => void;
  error: string | null;
}

type Props = {
  children: ReactNode;
};

// ** Create Context
export const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  // const currentHref = window.location.href;
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  const { mutate, isPending } = useMutation<
    AuthTokens,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => signIn(username, password),
    onSuccess: async (data) => {
      const { accessToken, refreshToken } = data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      await fetchUserData();
      const returnUrl = searchParams.get("returnUrl");
      const redirectUrl = returnUrl ? returnUrl : "/";
      navigate(redirectUrl);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message);
      }
    },
  });

  async function fetchUserData() {
    const userData = await getUserInfo();
    setUser(userData);
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const initAuth = async () => {
      if (accessToken) {
        try {
          setLoading(true);
          await fetchUserData();
        } catch (error) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  // function checkAccessRoute() {
  //   if (isUrlMatching(currentHref, ALL_URL)) {

  //   }
  // }

  // useEffect(() => {
  //   checkAccessRoute();
  // }, [currentHref]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: handleLogin,
        logout: handleLogout,
        isLoading: isLoading || isPending,
        setLoading,
        error,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
