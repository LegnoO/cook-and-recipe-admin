// ** Mui Imports
import { InputAdornment, IconButton } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";

// ** Components
import { Icon, TextField } from "@/components/ui";

// ** Library
import { Controller, Control } from "react-hook-form";

// ** Types
type Props = {
  control: Control<any>;
  showPassword: boolean;
  togglePassword: () => void;
} & TextFieldProps;

const PasswordInput = ({ togglePassword, showPassword, control }: Props) => {
  return (
    <Controller
      name="password"
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          variant="outlined"
          fullWidth
          label="Password"
          onChange={onChange}
          value={value}
          placeholder="············"
          type={showPassword ? "text" : "password"}
          error={Boolean(error)}
          helperText={error?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={togglePassword}
                  onMouseDown={(e) => e.preventDefault()}>
                  <Icon
                    fontSize="1.25rem"
                    icon={showPassword ? "tabler:eye" : "tabler:eye-off"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};
export default PasswordInput;
