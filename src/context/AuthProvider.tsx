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
import cookies from "js-cookie";

// ** Services
import {
  isRememberMeEnabled,
  getUserInfo,
  getUserPermission,
  signIn,
  handleRefreshToken,
} from "@/services/authService";

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
  loadingError: string | null;
}

type Props = {
  children: ReactNode;
};

// ** Create Context
export const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  const { mutate, isPending } = useMutation<
    AuthTokens,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => signIn(username, password),
    onSuccess: async ({ accessToken, refreshToken }) => {
      localStorage.setItem("accessToken", accessToken);
      const cookieOptions = { expires: isRememberMeEnabled ? 30 : 1 };
      cookies.set("refreshToken", refreshToken, cookieOptions);
      await fetchUserData();
      navigate(searchParams.get("returnUrl") || "/");
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response) {
        setLoadingError(error.response.data.message);
      }
    },
  });

  async function fetchUserData() {
    try {
      const userInfo = await getUserInfo();
      const userPermission = await getUserPermission();

      setUser({ ...userInfo, permission: userPermission });
    } finally {
      setLoading(false);
    }
  }

  async function refreshUserData() {
    try {
      await handleRefreshToken();
      await fetchUserData();
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const accessTokenSession = localStorage.getItem("accessToken");
    const refreshTokenSession = cookies.get("refreshToken");
    // async function initializeAuth() {
    //   try {
    //     await fetchUserData();
    //   } catch {
    //     handleLogout();
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    if (accessTokenSession && refreshTokenSession) {
      fetchUserData();
    } else if (!accessTokenSession && refreshTokenSession) {
      refreshUserData();
    } else {
      setLoading(false);
    }
  }, []);

  function handleLogin({ username, password }: LoginCredentials) {
    if (username && password) {
      mutate({ username, password });
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    cookies.remove("refreshToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: handleLogin,
        logout: handleLogout,
        isLoading: isLoading || isPending,
        setLoading,
        loadingError,
        test: fetchUserData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
