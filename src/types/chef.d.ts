type ChefLevel = "Beginner" | "Home cook" | "Professional" | "Master chef";

type ChefStatus = "active" | "disabled" | "pending" | "rejected" | "banned";

type FilterChef = {
  fullName: string;
  email: string | null;
  level: ChefLevel | null;
  chefStatus: ChefStatus | null;
};

type FilterChefPending = Omit<FilterChef, "chefStatus">;

type Chef = {
  id: string;
  level: ChefLevel;
  startedDate: Date;
  description: string;
  status: ChefStatus;
  userInfo: ChefUserInfo;
};

type ChefDetail = {
  id: string;
  level: ChefLevel;
  startedDate: Date;
  description: string;
  status: ChefStatus;
  approvalBy: ChefUserInfo;
  approvalDate: Date;
  userInfo: ChefUserInfo;
};

interface ChefUserInfo {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  userInfo: ChefUserInfo;
}

type ListChef = {
  data: Chef[];
  paginate: FilterChef;
};
