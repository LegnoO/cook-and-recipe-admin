type Action = "create" | "read" | "update" | "delete";
type AuthTokens = string;
type Messages = string;

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface Permission {
  permission: RoutePermission[];
}

interface RoutePermission {
  page: string;
  actions: Action;
}

type Role = {
  _id: string;
  name: string;
  status: boolean;
  createdDate: string;
  updatedDate: string | null;
  disabledDate: string | null;
} & Permission;
