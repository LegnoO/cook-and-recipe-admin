export type User = {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
  avatar: string | null;
  group: "Admin";
  permission: IRoutePermission[]
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginCredentials = {
  username?: string;
  password?: string;
};

export interface IRoutePermission {
  page: string;
  actions: string[];
}
