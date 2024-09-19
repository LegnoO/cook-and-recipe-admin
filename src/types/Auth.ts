type Action = "create" | "read" | "update" | "delete";
export type AuthTokens = string;
export type Messages = string;

export interface IUserInfo {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
  avatar: string;
  permission: IRoutePermission[];
  group: string;
}

export type LoginCredentials = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export interface IRoutePermission {
  page: string;
  actions: Action;
}
