type Action = "create" | "read" | "update" | "delete";
type AuthTokens = string;
type Messages = string;

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
  avatar: string;
  permission: RoutePermission[];
  group: string;
}

type LoginCredentials = {
  username: string;
  password: string;
  rememberMe: boolean;
};

interface RoutePermission {
  page: string;
  actions: Action;
}

interface Role {
  updatedDate: string | null;
  disabledDate: string | null;
  _id: string;
  name: string;
  permissions: RoutePermission[];
  status: boolean;
  createdDate: string;
  updateDate: string | null;
  disableDate: string | null;
}
