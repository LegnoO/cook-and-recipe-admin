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
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";

// ** Services
import {
  getUserInfo,
  getUserPermission,
  signIn,
  signOut,
} from "@/services/authService";

// ** Config
import { loginRoute } from "@/config/url";

// ** Types
export interface IAuthContext {
  user: User | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  login: ({ username, password, rememberMe }: LoginCredentials) => void;
  loadingError: string | null;
  refetchInfo: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

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
        if (window.location.pathname === loginRoute)
          navigate(searchParams.get("returnUrl") || "/");
      } catch (error) {
        handleLogout();
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(data: LoginCredentials) {
    try {
      setLoading(true);
      await signIn(data);
      await fetchUserData();
      navigate(searchParams.get("returnUrl") || "/");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setLoadingError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    const isLoginPage = "/login";
    try {
      if (currentPathname !== isLoginPage) {
        await signOut();
        navigate(isLoginPage);
        localStorage.removeItem("access-token");
        setUser(null);
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
        isLoading: isLoading,
        setLoading,
        loadingError,
        refetchInfo: refreshUserData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
