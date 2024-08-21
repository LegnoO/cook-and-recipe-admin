// ** Overrides Imports
import Button from "./button";
import MuiTypography from "./typography";

const Overrides = () => {
  const button = Button();
  return Object.assign(button, MuiTypography);
};

export default Overrides;
