// ** React Imports
import { useState } from "react";

// ** Mui Imports
import { Switch } from "@mui/material";

type Props = {
  checked: boolean;
  color:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "default";
  onChange: () => Promise<void>;
};
const Switches = ({ onChange, checked, color }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Switch
      disabled={isLoading}
      onChange={async () => {
        setIsLoading(true);
        await onChange();
        setIsLoading(false);
      }}
      checked={checked}
      color={color}
    />
  );
};
export default Switches;
