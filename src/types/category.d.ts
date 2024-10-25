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

type CategoryDetail = Category & { disabledBy?: ChefUserInfo };

type CategoryUpdate = {
  name: string;
  description: string;
};

type ListCategory = {
  data: Category[];
  paginate: Filter<FilterCategory>;
};

type FilterCategory = {
  name: string;
  status: null | boolean;
};
