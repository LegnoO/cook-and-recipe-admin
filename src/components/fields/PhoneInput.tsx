// ** Mui Imports
import {
  IconButton,
  InputAdornment,
  Divider,
  TextFieldProps,
} from "@mui/material";

// ** Library Imports
import { Controller, Control } from "react-hook-form";

// ** Components
import { TextField, Icon } from "@/components/ui";

// ** Utils
import { formatPhoneNumber } from "@/utils/helpers";

// ** Types
type Props = {
  name: string;
  control: Control<any>;
  fullWidth?: boolean;
  label?: string;
  placeholder?: string;
} & TextFieldProps;

const PhoneInput = ({
  fullWidth,
  label,
  control,
  name,
  placeholder,
  ...rest
}: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <TextField
          ref={ref}
          label={label}
          fullWidth={fullWidth}
          variant="outlined"
          value={value || ""}
          placeholder={placeholder}
          onChange={(event) => onChange(formatPhoneNumber(event.target.value))}
          error={Boolean(error)}
          helperText={error?.message}
          inputProps={{
            maxLength: 12,
          }}
          InputProps={{
            startAdornment: (
              <>
                <InputAdornment sx={{ mr: 0 }} position="start">
                  <IconButton disableRipple edge="start">
                    <Icon fontSize="1.25rem" icon={"flag:vn-4x3"} />
                  </IconButton>
                </InputAdornment>
                <Divider
                  sx={{ mr: 1 }}
                  orientation="vertical"
                  variant="middle"
                  flexItem
                />
              </>
            ),
          }}
          {...rest}
        />
      )}
    />
  );
};
export default PhoneInput;
