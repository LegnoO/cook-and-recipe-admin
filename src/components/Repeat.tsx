// ** React Imports
import { Fragment, ReactNode } from "react";

// ** Types
type Props = {
  times?: number;
  children: ReactNode;
};

const Repeat = ({ times = 1, children }: Props) => {
  return (
    <>
      {Array.from({ length: times }).map((_, index) => (
        <Fragment key={index}>{children}</Fragment>
      ))}
    </>
  );
};
export default Repeat;
