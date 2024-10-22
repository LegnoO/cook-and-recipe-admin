type Gender = "Male" | "Female" | "Other";

type Address = {
  number: string;
  street: string;
  ward: string;
  district: string;
  city: string;
};

type SortOrder = "" | "asc" | "desc";

type Sort = {
  sortBy: string;
  sortOrder: SortOrder;
};

type Filter<T> = T & Paginate & Sort;

type Paginate = {
  index: number;
  size: number;
  total: number | null;
};

type JSONString<T> = string;

type ColorVariant = "active" | "success" | "disabled" | "warning" | "error" | "banned"

type Align = "center" | "inherit" | "justify" | "left" | "right";

type BodyCell<T> = {
  render: (row: T) => ReactNode;
  align?: Align;
};