type GroupSubmit = {
  name: string;
  permissions: {
    page: string;
    actions: PermissionAction[];
  }[];
};

interface Group {
  members?: number;
  createdDate: Date;
  disabledDate?: Date;
  id: string;
  name: string;
  permissions: PermissionsFetch[];
  status: boolean;
  updatedDate?: Date;
}

type FilterGroup = {
  name?: string;
  status?: string;
} & Sort &
  Paginate;
