// ** React Imports
import {
  SetStateAction,
  Dispatch,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ** Library Imports
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  function redirectToHref(user: User) {
    let href = "/recipes";
    let returnUrlHref = decodeURIComponent(window.location.search).split(
      "returnUrl=",
    )[1];

    if (user) {
      const pageNames = user.permission.map((perm) => perm.page);
      pageNames.forEach((pageName) => {
        if (pageName === "dashboard") {
          href = "/dashboard";
        } else if (pageName === "recipes") {
          href = "/recipes";
        }
      });
    }
    if (returnUrlHref === "/") {
      returnUrlHref = href;
    }

    const url = returnUrlHref || href;

    navigate(url);
  }

  async function fetchUserData() {
    const userInfo = await getUserInfo();
    const userPermission = await getUserPermission();

    const updatedUser = { ...userInfo, permission: userPermission };
    redirectToHref(updatedUser);
    setUser(updatedUser);
  }

  async function refreshUserData() {
    await fetchUserData();
  }

  useEffect(() => {
    const accessTokenSession = localStorage.getItem("access-token");
    if (!user) {
      if (pathname !== loginRoute) {
        const returnUrl = searchParams ? searchParams.toString() : null;
        const redirectToLogin = returnUrl
          ? `${loginRoute}?returnUrl=${pathname}?${returnUrl}`
          : `${loginRoute}?returnUrl=${pathname}`;

        navigate(redirectToLogin);
      }
    }

    async function initializeAuth() {
      try {
        if (accessTokenSession) {
          await fetchUserData();
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
    if (pathname !== loginRoute) {
      await signOut();
      navigate(loginRoute);
      localStorage.removeItem("access-token");
      setUser(null);
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
