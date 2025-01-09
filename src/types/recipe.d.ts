type Difficulty = "Easy" | "Normal" | "Hard" | "Professional" | "Expert";

type VerifyStatus = "verified" | "rejected" | "revoke";

type RecipeFilter = {
  name?: string;
  difficulty?: Difficulty;
  status?: string;
  verifyStatus?: VerifyStatus;
};

type RecipeFilterPending = Omit<RecipeFilter, "status" | "verifyStatus">;

type Recipe = {
  id: string;
  name: string;
  timeToCook: number;
  difficulty: Difficulty;
  serves: number;
  imageUrls: string[];
  status: boolean;
  verifyStatus: string;
  createdDate: Date;
  createdBy: ChefUserInfo;
  approvalBy: ChefUserInfo;
};

type ListRecipe = {
  data: Recipe[];
  paginate: Filter<RecipeFilter>;
};

type ListRecipePending = {
  data: Recipe[];
  paginate: Filter<RecipeFilterPending>;
};

interface Ingredient {
  name: string;
  quantity: number;
  measurement?: string;
}

interface Instructions {
  step: number;
  description: string;
}
[];

interface RecipeDetail {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructionSections: { title: string; instructions: Instructions[] }[];
  timeToCook: string;
  difficulty: Difficulty;
  serves: number;
  imageUrls: string[];
  status: boolean;
  verifyStatus: "pending" | "approved" | "rejected";
  createdDate: Date;
  approvalDate: Date | null;
  category: { id: string; name: string; description: string; email: string };
  createdBy: {
    level: ChefLevel;
    startedDate: Date;
    description: string;
    userInfo: ChefUserInfo;
  };
  approvalBy?: ChefUserInfo;
}
