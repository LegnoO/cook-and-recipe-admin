type Action = "create" | "read" | "update" | "delete";
type AuthTokens = string;
type Messages = string;

interface IUserInfo {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
  avatar: string;
  permission: IRoutePermission[];
  group: string;
}

type LoginCredentials = {
  username: string;
  password: string;
  rememberMe: boolean;
};

interface IRoutePermission {
  page: string;
  actions: Action;
}
