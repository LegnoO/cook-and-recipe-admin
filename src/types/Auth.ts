export type User = {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginCredentials = {
  username?: string;
  password?: string;
};
