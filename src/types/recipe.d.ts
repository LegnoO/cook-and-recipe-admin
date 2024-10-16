type FilterRecipe = {
  name: string;
  difficulty: "Easy" | "Normal" | "Hard" | "Professional" | "Expert";
  status: boolean;
  verifyStatus: "verified" | "rejected" | "revoke";
};

type FilterRecipePending = Omit<FilterRecipe, "status", "verifyStatus">;

type ListRecipe = {
  data: Recipe[];
  paginate: Filter<FilterRecipe>;
};

type ListRecipePending = {
  data: Recipe[];
  paginate: Filter<FilterRecipePending>;
};
