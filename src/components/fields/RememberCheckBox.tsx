// ** React Imports
import { ChangeEvent,Dispatch ,SetStateAction} from "react";

// ** Mui Imports
import { styled } from "@mui/material/styles";
import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import {  Checkbox } from "@mui/material";

// ** Library
import { Controller, Control } from "react-hook-form";

// ** Types
type Props = {
  control: Control<any>;
  setRememberMe: Dispatch<SetStateAction<boolean>>
};

// ** Styled Components
const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    "& .MuiFormControlLabel-label": {
      color: theme.palette.text.secondary,
    },
  }),
);

const RememberCheckBox = ({ control, setRememberMe }: Props) => {
  function toggleRememberMe(
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  ) {
    onChange(event);
    setRememberMe(event.target.checked);
  }
  return (
    <Controller
      name="rememberMe"
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={field.value}
              onChange={(event) => toggleRememberMe(event, field.onChange)}
            />
          }
          label="Remember Me"
        />
      )}
    />
  );
};
export default RememberCheckBox;
