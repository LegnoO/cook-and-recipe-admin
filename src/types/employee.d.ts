type ListEmployees = {
  data: Employee[];
  paginate: FilterEmployees;
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

type FilterEmployees = {
  fullName: string;
  groupId: string | null;
  status: string | null;
  gender: Gender | null;
};
