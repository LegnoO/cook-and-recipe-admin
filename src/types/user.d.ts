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
