export type User = {
  username: string;
  role: "admin" | "manage";
  token: string;
};

export interface LoginCredentials {
  username?: string;
  password?: string;
}
