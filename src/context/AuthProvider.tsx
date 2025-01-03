// ** React Imports
import {
  SetStateAction,
  Dispatch,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ** Library ImportsImports
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// ** Services
import {
  getUserInfo,
  getUserPermission,
  signIn,
  signOut,
} from "@/services/authService";

// ** Config
import { loginRoute } from "@/config/url";

// ** Utils
import { handleToastMessages } from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

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
  can: (page: string, action: string | string[]) => boolean;
}

type Props = {
  children: ReactNode;
};

// ** Create Context
export const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  async function fetchUserData() {
    const userInfo = await getUserInfo();
    const userPermission = await getUserPermission();

    const updatedUser = { ...userInfo, permission: userPermission };

    setUser(updatedUser);
  }

  async function refreshUserData() {
    await fetchUserData();
  }

  useEffect(() => {
    const accessTokenSession = localStorage.getItem("access-token");
    if (!user) {
      const redirectToLogin =
        pathname !== loginRoute
          ? `${loginRoute}?returnUrl=${pathname}`
          : loginRoute;

      navigate(redirectToLogin);
    }

    async function initializeAuth() {
      try {
        if (accessTokenSession) {
          await fetchUserData();
          const searchParams = new URLSearchParams(window.location.search);
          navigate(searchParams.get("returnUrl") || "/");
        } else {
          await refreshUserData();
        }
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
      const searchParams = new URLSearchParams(window.location.search);
      navigate(searchParams.get("returnUrl") || "/");
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      const showErrorMessages = handleToastMessages((error) =>
        toast.error(error),
      );
      if (typeof errorMessage === "string") {
        setLoadingError(errorMessage);
      }
      showErrorMessages(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const isLoginPage = "/login";
    try {
      if (pathname !== isLoginPage) {
        await signOut();
        navigate(isLoginPage);
        localStorage.removeItem("access-token");
        setUser(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function can(page: string, action: string | string[]): boolean {
    if (!user || !user.permission) {
      return false;
    }

    const pagePermission = user.permission.find((perm) => perm.page === page);
    if (!pagePermission) {
      return false;
    }

    if (typeof action === "string") {
      return pagePermission.actions.includes(action);
    }

    if (Array.isArray(action)) {
      return action.every((item) => pagePermission.actions.includes(item));
    }

    return false;
  }

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
        can,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
