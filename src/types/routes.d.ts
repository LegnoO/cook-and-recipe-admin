 interface ProtectedRoute {
  path: string;
  component: JSX.Element;
  permission: {
    page: string;
    action: "read";
  };
}

 interface PublicRoute {
  path: string;
  component: JSX.Element;
}
