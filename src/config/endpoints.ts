export const userEndpoints = {
  logout: `/auth/logout`,
  login: `/auth/admin/login`,
  refreshInfo: `/auth/refresh`,
  getInfo: `/users/owned/info`,
  getProfile: `/users/owned/profile`,
  getPermissions: `/groups/admin/own/permissions`,
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
  queryGroups: (params: string) => `/groups/admin/find?${params}`,
  getDetailGroup: (groupId: string) => `/groups/admin/find/${groupId}`,
  editGroup: (groupId: string) => `/groups/admin/find/${groupId}/edit`,
  toggleGroupStatus: (groupId: string) =>
    `/groups/admin/find/${groupId}/toggle-status`,
};

export const permissionEndpoints = {
  getPermissions: `/permissions`,
};

export const employeeEndpoints = {
  createEmployee: `/employees/admin`,
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
