export type ListEmployees = {
  address: Address;
  avatar: string;
  dateOfBirth: string | null;
  email: string;
  fullName: string;
  group: string;
  id: string;
  phone: string | null;
  status: boolean;
};

export interface IUserProfile {
  group: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  fullName: string;
  username: string;
  avatar: string;
  createdDate: string;
  gender?: "Male" | "Female" | "Other";
  address: Address;
}

export type Address = {
  number: string;
  street: string;
  ward: string;
  district: string;
  city: string;
};
