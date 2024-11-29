type ListEmployees = {
  data: Employee[];
  paginate: FilterEmployees;
};

type Employee = {
  address: Address;
  avatar: string;
  dateOfBirth?: string;
  email: string;
  fullName: string;
  group: { name: string; id: string };
  id: string;
  phone?: string;
  status: boolean;
  gender?: Gender;
  id: string;
  disabledDate?: string;
  createdDate: string;
};

type FilterEmployees = {
  fullName: string;
  groupId: string | null;
  status: string | null;
  gender: Gender | null;
};
