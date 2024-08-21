// ** React
import { ReactNode, Suspense as ReactSuspense } from "react";

// ** Library
import { Outlet } from "react-router-dom";

const Suspense = ({ fallback }: { fallback: ReactNode }) => {
  return (
    <ReactSuspense fallback={fallback}>
      <Outlet />
    </ReactSuspense>
  );
};

export default Suspense;
