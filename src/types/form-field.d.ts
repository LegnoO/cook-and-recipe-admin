interface ResponsiveSize {
  md?: number;
  xs?: number;
}
type MenuText = string;
type MenuObject = { value: any; label: ReactNode };
type MenuItem = MenuText | MenuObject;

interface FormField {
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: string;
  type: "input" | "date" | "select" | "children";
  size?: ResponsiveSize;
  children?: FormField[];
  menuItems?: MenuItem[];
}

type Select = {
  isLoading?: boolean;
  menuItems?: MenuItem[];
  endIcon?: string;
  startIcon?: string;
  defaultOption?: string;
  disableDefaultOption?: boolean;
};
