export type User = {
  username: string;
  role: "admin" | "manage";
};

export interface LoginCredentials {
  username?: string;
  password?: string;
}
