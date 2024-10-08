// ** React Imports
import { memo, ReactNode } from "react";

type Props = {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
};
const RenderIf = ({ condition, fallback, children }: Props) => {
  return condition ? children : fallback || null;
};

export default memo(RenderIf);
