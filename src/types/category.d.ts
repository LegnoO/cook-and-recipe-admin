type Category = {
  id: string;
  name: string;
  description: string;
  createdDate: Date;
  updatedDate: Date | null;
  disabledDate: Date | null;
  createdBy: ChefUserInfo;
  status: boolean;
};

type ListCategory = {
  data: Category[];
  paginate: Filter<FilterCategory>;
};

type FilterCategory = {
  name: string;
  status: null | boolean;
};
