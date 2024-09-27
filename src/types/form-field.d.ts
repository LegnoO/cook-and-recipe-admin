interface ResponsiveSize {
  md?: number;
  xs?: number;
}
type MenuText = string;
type MenuObject = { value: string; label: string };
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

type Value = {
  value: string;
  label: any;
};

type datalist = {
  name: string;
  data: any;
};
