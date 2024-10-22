export const authEndpoints = {
  logout: `/auth/logout`,
  login: `/auth/admin/login`,
  refreshInfo: `/auth/refresh`,
};

export const chefEndpoints = {
  queryChef: (params: string) => `/chefs/admin/find?${params}`,
  getChefDetail: (chefId: string) => `/chefs/admin/find/${chefId}`,
  disableChef: (chefId: string) => `/chefs/admin/find/${chefId}/ban`,
  activeChef: (chefId: string) => `/chefs/admin/find/${chefId}/unban`,
  queryChefPending: (params: string) => `/chefs/admin/find/pending?${params}`,
  toggleChefRequest: (chefId: string) =>
    `/chefs/admin/find/pending/${chefId}/approve-or-reject`,
};

export const groupEndpoints = {
  createGroup: `/groups/admin`,
  getActiveGroup: `/groups/admin/find/active`,
  getPermissions: `/groups/admin/own/permissions`,
  queryGroups: (params: string) => `/groups/admin/find?${params}`,
  getDetailGroup: (groupId: string) => `/groups/admin/find/${groupId}`,
  editGroup: (groupId: string) => `/groups/admin/find/${groupId}/edit`,
  toggleGroupStatus: (groupId: string) =>
    `/groups/admin/find/${groupId}/toggle-status`,
};

export const permissionEndpoints = {
  getPermissions: `/permissions/admin/find`,
};

export const employeeEndpoints = {
  getInfo: `/employees/admin/info`,
  createEmployee: `/employees/admin`,
  getProfile: `/employees/admin/profile`,
  updateProfileEmployee: "/employees/admin/profile/edit",
  updateAllGroupEmployees: `/employees/admin/update-group`,
  queryEmployees: (params: string) =>
    `/employees/admin/find?${params.toString()}`,
  getDetailEmployee: (employeeId: string) =>
    `/employees/admin/find/${employeeId}`,
  updateEmployee: (employeeId: string) =>
    `/employees/admin/find/${employeeId}/edit`,
  toggleStatusEmployee: (employeeId: string) =>
    `/employees/admin/find/${employeeId}/toggle-status`,
};

export const recipeEndpoints = {
  queryRecipe: (params: string) => `/recipe/admin/find?${params.toString()}`,
  queryRecipePending: (params: string) =>
    `/recipe/admin/find/pending?${params.toString()}`,
  getDetailRecipe: (recipeId: string) => `/recipe/admin/find/${recipeId}`,
  toggleRecipeRequest: (recipeId: string) =>
    `/recipe/admin/find/pending/${recipeId}/approve-or-reject`,
  revokeApprovalRecipe: (recipeId: string) =>
    `/recipe/admin/find/${recipeId}/revoke-approval`,
  privateRecipe: (recipeId: string) => `/recipe/admin/find/${recipeId}/private`,
};

export const categoryEndpoints = {
  createCategory: `/category/admin`,
  queryCategory: `/category/admin/find`,
  getDetailCategory: (categoryId: string) =>
    `/category/admin/find/${categoryId}`,
  updateCategory: (categoryId: string) =>
    `/category/admin/find/${categoryId}/edit`,
  toggleStatusCategory: (categoryId: string) =>
    `/category/admin/find/${categoryId}/toggle-status`,
};
