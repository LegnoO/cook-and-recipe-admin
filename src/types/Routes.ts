export interface ProtectedRoute {
  path: string;
  component: JSX.Element;
  permission: {
    page: string;
    action: "read";
  };
}

export interface PublicRoute {
  path: string;
  component: JSX.Element;
}
