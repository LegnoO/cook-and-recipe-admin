type PermissionAction = "create" | "read" | "delete" | "approve" | "pending";
type PermissionActionObject = {
  name: PermissionAction;
  checked?: boolean;
};

interface PermissionsFetch {
  page: string;
  checked?: boolean;
  actions: PermissionAction[];
}

interface Permissions {
  page: string;
  checked?: boolean;
  actions: PermissionActionObject[];
}
