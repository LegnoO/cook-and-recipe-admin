type User = {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  group: { name: string; id: string };
} & Permission;

type UserProfile = {
  fullName: string;
  email: string;
  dateOfBirth?: Date;
  avatar: string;
  address?: Address;
  gender: Gender;
  phone?: string;
  createdDate: Date;
  group: string;
  chefInfo: {
    startedDate?: Date;
    description?: string;
    level: ChefLevel;
    status: ChefStatus;
    approvalDate?: Date;
    disabledDate?: Date;
  };
};

type Client = {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth?: Date;
  address?: Address;
  phone?: string;
  avatar: string;
  status: boolean;
};

type ClientResponse = {
  data: Client[];
  paginate: ClientFilter;
};

type ClientFilter = {
  total?: number;
  fullName?: string;
  groupId?: string;
  status?: string;
  gender?: Gender;
};
