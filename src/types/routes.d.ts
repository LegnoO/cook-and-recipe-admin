interface Route {
  path?: string;
  component?: JSX.Element;
  permission?: {
    page: string;
    action: "read" | "pending" | "approve";
  };
  children?: Route[];
}
