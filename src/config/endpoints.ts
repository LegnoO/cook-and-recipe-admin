export const authEndpoints = {
  logout: `/auth/logout`,
  login: `/auth/admin/login`,
  refreshInfo: `/auth/refresh`,
};

export const chefEndpoints = {
  queryChefPending: (params: string) => `/chefs/admin/find/pending?${params}`,
  queryChef: (params: string) => `/chefs/admin/find?${params}`,
  toggleChefRequest: (chefId: string) =>
    `/chefs/admin/find/pending/${chefId}/approve-or-reject`,
  disableChef: (chefId: string) => `/chefs/admin/find/${chefId}/ban`,
  activeChef: (chefId: string) => `/chefs/admin/find/${chefId}/unban`,
  getChefDetail: (chefId: string) => `/chefs/admin/find/${chefId}`,
};

export const groupEndpoints = {
  createGroup: `/groups/admin`,
  getActiveGroup: `/groups/admin/find/active`,
  getPermissions: `/groups/admin/own/permissions`,
  queryGroups: (params: string) => `/groups/admin/find?${params}`,
  getDetailGroup: (groupId: string) => `/groups/admin/find/${groupId}`,
  editGroup: (groupId: string) => `/groups/admin/find/${groupId}/edit`,
  deleteGroup: (groupId: string) => `/groups/admin/find/${groupId}/delete`,
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
  queryEmployees: (params: string) => `/employees/admin/find?${params}`,
  getDetailEmployee: (employeeId: string) =>
    `/employees/admin/find/${employeeId}`,
  updateEmployee: (employeeId: string) =>
    `/employees/admin/find/${employeeId}/edit`,
  toggleStatusEmployee: (employeeId: string) =>
    `/employees/admin/find/${employeeId}/toggle-status`,
};

export const recipeEndpoints = {
  queryRecipe: (params: string) => `/recipe/admin/find?${params}`,
  queryRecipePending: (params: string) =>
    `/recipe/admin/find/pending?${params}`,
  getDetailRecipe: (recipeId: string) => `/recipe/admin/find/${recipeId}`,
  toggleRecipeRequest: (recipeId: string) =>
    `/recipe/admin/find/pending/${recipeId}/approve-or-reject`,
  revokeApprovalRecipe: (recipeId: string) =>
    `/recipe/admin/find/${recipeId}/revoke-approval`,
  privateRecipe: (recipeId: string) => `/recipe/admin/find/${recipeId}/private`,
};

export const userEndpoints = {
  queryUsers: (params: string) => `/users/admin/find?${params}`,
  toggleStatusUser: (userId: string) =>
    `/users/admin/find/${userId}/toggle-status`,
};

export const categoryEndpoints = {
  queryCategory: (params: string) => `/category/admin/find?${params}`,
  getDetailCategory: (categoryId: string) =>
    `/category/admin/find/${categoryId}`,
  createCategory: `/category/admin`,
  updateCategory: (categoryId: string) =>
    `/category/admin/find/${categoryId}/edit`,
  toggleStatusCategory: (categoryId: string) =>
    `/category/admin/find/${categoryId}/toggle-status`,
  deleteCategory: (categoryId: string) =>
    `/category/admin/find/${categoryId}/delete`,
};

export const notifyEndpoints = {
  queryNotify: (params: string) => `/notification/admin/find?${params}`,
};

export const statisticsEndpoints = {
  userTotalStatistics: `/statistic/admin/total/user`,
};
