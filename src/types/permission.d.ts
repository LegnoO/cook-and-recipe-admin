type PermissionAction = "create" | "read" | "delete" | "approve" | "pending";
type PermissionActionObject = {
  name: PermissionAction;
  checked?: boolean;
};

interface PagePermissions {
  page: string;
  actions: PermissionAction[];
}

interface PagePermissionsSelected {
  page: string;
  actions: PermissionActionObject[];
}
