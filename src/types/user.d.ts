type ListEmployees = {
  data: Employee[];
  paginate: Paginate;
};

type Employee = {
  address: Address;
  avatar: string;
  dateOfBirth: Date | null;
  email: string;
  fullName: string;
  group: string;
  id: string;
  phone: string | null;
  status: boolean;
};

interface UserProfile {
  group: string;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
  fullName: string;
  username: string;
  avatar: string;
  createdDate: Date | null;
  gender?: "Male" | "Female" | "Other";
  address: Address;
}

type UserProfileDraft = Omit<
  UserProfile,
  "group" | "email" | "avatar" | "gender" | "address" | "username"
>;

type Address = {
  number: string;
  street: string;
  ward: string;
  district: string;
  city: string;
};

type Paginate = {
  index: number;
  size: number;
  total: number;
};
