// ** Overrides Imports
import Button from "./button";

import Tooltip from "./tooltip";
import MuiTypography from "./typography";

const Overrides = () => {
  const button = Button();
  const tooltip = Tooltip();
  return Object.assign(button, tooltip, MuiTypography);
};

export default Overrides;
