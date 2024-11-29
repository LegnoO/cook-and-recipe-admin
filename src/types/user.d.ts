type User = {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
  avatar: string;
  group: { name: string; id: string };
} & Permission;

type UserProfile = {
  username: string;
  phone: string | null;
  createdDate: Date | null;
  gender?: Gender;
  address: Address;
  groupId?: string;
} & Omit<User, "permission">;

type UserProfileDraft = Omit<
  UserProfile,
  "group" | "email" | "avatar" | "gender" | "address" | "username"
>;
