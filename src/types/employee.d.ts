type EmployeeProfile = Omit<UserProfile, "chefInfo"> & {
  group: string;
  username: string;
};

type EmployeeProfileDraft = Omit<
  UserProfile,
  "group" | "email" | "avatar" | "gender" | "username" | "chefInfo"
>;

type ListEmployees = {
  data: Employee[];
  paginate: FilterEmployees;
};

type UserDetail = {
  id: string;
  fullName: string;
  email: string;
  address: Address;
  dateOfBirth?: Date;
  gender?: Gender;
  phone?: string;
  avatar: string;
  status: boolean;
  createdBy?: string;
  createdDate: Date;
  disabledBy?: string;
  disabledDate?: Date;
  createdDate: Date;
};

type EmployeeDetail = UserDetail & {
  username: string;
  group: { name: string; id: string };
};

type FilterEmployees = {
  fullName: string;
  groupId: string | null;
  status: string | null;
  gender: Gender | null;
};
