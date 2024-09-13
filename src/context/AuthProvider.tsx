// ** React Imports
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
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

// ** Services
import {
  getUserInfo,
  getUserPermission,
  signIn,
  signOut,
} from "@/utils/services/authService";

// ** Types
import { LoginCredentials, UserInfo, AuthTokens } from "@/types/Auth";
import { AxiosError } from "axios";

export interface IAuthContext {
  user: UserInfo | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<UserInfo | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  login: ({ username, password, rememberMe }: LoginCredentials) => void;
  loadingError: string | null;
}

type Props = {
  children: ReactNode;
};

// ** Create Context
export const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const location = useLocation();
  const currentPathname = location.pathname;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  // console.table({ user });
  const { mutate, isPending } = useMutation<
    AuthTokens,
    Error,
    LoginCredentials
  >({
    mutationFn: (data) => signIn({ ...data }),
    onSuccess: async (accessToken) => {
      localStorage.setItem("access-token", accessToken);
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
    const userInfo = await getUserInfo();
    const userPermission = await getUserPermission();

    setUser({ ...userInfo, permission: userPermission });
  }

  async function refreshUserData() {
    await fetchUserData();
  }

  useEffect(() => {
    const accessTokenSession = localStorage.getItem("access-token");

    async function initializeAuth() {
      try {
        if (accessTokenSession) await fetchUserData();

        if (!accessTokenSession) await refreshUserData();
      } catch (error) {
        console.error(error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogin(data: LoginCredentials) {
    mutate(data);
  }

  const handleLogout = async () => {
    const isLoginPage = "/login";
    try {
      if (currentPathname !== isLoginPage) {
        navigate(isLoginPage);
        localStorage.removeItem("access-token");
        setUser(null);
        await signOut();
      }
    } catch (error) {
      console.error(error);
    }
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
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
