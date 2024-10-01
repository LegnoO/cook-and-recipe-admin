type ListEmployees = {
  data: Employee[];
  paginate: Paginate;
};

type Employee = {
  address: Address;
  avatar: string;
  dateOfBirth?: Date;
  email: string;
  fullName: string;
  group: string;
  id: string;
  phone?: string;
  status: boolean;
  gender?: Gender;
  id: string;
  disabledDate?: Date;
  createdDate: Date;
  groupId?: string;
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
  gender?: Gender;
  address: Address;
  groupId?: string;
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

type Filter = {
  index: number;
  size: number;
  total: number | null;
  search: string | null;
  groupId: string | null;
  status: string | null;
  gender: Gender | null;
  sortBy: string | null;
  sortOrder: 1 | -1 | '';
};

type Gender = "Male" | "Female" | "Other";
