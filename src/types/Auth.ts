export type UserInfo = {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
  avatar: string | null;
  permission: IRoutePermission[];
  group: string;
};

export interface IUserProfile {
  group: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  fullName: string;
  username: string;
  avatar: string | null;
  createdDate: string;
  address: {
    number: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  };
}

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
