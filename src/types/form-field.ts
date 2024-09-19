export interface ResponsiveSize {
  md?: number;
  xs?: number;
}

export interface FormField {
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: string;
  type?: "input" | "date" | "select" | "children" | "space";
  size?: ResponsiveSize;
  space?: ResponsiveSize;
  children?: FormField[];
}
