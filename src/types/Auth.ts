export type UserInfo = {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
  avatar: string | null;
  permission: IRoutePermission[];
  group: string;
};

export type UserProfile = {
  email: string;
  dateOfBirth: Date | null;
  fullName: string;
  username: string;
  group: string;
  avatar: string | null;
};

export type AuthTokens = string;

export type Messages = string;

export type LoginCredentials = {
  username: string;
  password: string;
  rememberMe: boolean;
};

type Action = "create" | "read" | "update" | "delete";
export interface IRoutePermission {
  page: string;
  actions: Action;
}
