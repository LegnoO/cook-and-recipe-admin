type Difficulty = "Easy" | "Normal" | "Hard" | "Professional" | "Expert";

type FilterRecipe = {
  name: string;
  difficulty: Difficulty | null;
  status: null | boolean;
  verifyStatus: null | "verified" | "rejected" | "revoke";
};

type FilterRecipePending = Omit<FilterRecipe, "status" | "verifyStatus">;

type Recipe = {
  id: string;
  name: string;
  timeToCook: number;
  difficulty: Difficulty;
  serves: number;
  imageUrls: [];
  status: boolean;
  verifyStatus: string;
  createdDate: Date;
  createdBy: ChefUserInfo;
};

type ListRecipe = {
  data: Recipe[];
  paginate: Filter<FilterRecipe>;
};

type ListRecipePending = {
  data: Recipe[];
  paginate: Filter<FilterRecipePending>;
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
  categories: string[];
  createdBy: {
    level: ChefLevel;
    startedDate: Date;
    description: string;
    userInfo: ChefUserInfo;
  };
  approvalBy?: ChefUserInfo;
}
