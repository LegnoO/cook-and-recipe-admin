// ** Mui Imports
import {
  IconButton,
  InputAdornment,
  Divider,
  TextFieldProps,
} from "@mui/material";

// ** Library Imports
import { Controller, UseFormReturn, FieldValues, Path } from "react-hook-form";

// ** Components
import { TextField, Icon } from "@/components/ui";

// ** Utils
import { formatPhoneNumber } from "@/utils/helpers";

// ** Types
type Props<T extends FieldValues> = {
  form?: UseFormReturn<T>;
  name: Path<T>;
  fullWidth?: boolean;
  label?: string;
  placeholder?: string;
} & Omit<TextFieldProps, "name">;

const PhoneInput = <T extends FieldValues>({
  fullWidth,
  label,
  form,
  name,
  placeholder,
  ...rest
}: Props<T>) => {
  if (form) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({
          field: { onChange, value, ref },
          fieldState: { error },
        }) => (
          <TextField
            ref={ref}
            label={label}
            fullWidth={fullWidth}
            variant="outlined"
            value={value || ""}
            placeholder={placeholder}
            onChange={(event) =>
              onChange(formatPhoneNumber(event.target.value))
            }
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
  }

  return (
    // <TextField
    //   ref={ref}
    //   label={label}
    //   fullWidth={fullWidth}
    //   variant="outlined"
    //   value={value || ""}
    //   placeholder={placeholder}
    //   onChange={(event) => onChange(formatPhoneNumber(event.target.value))}
    //   error={Boolean(error)}
    //   helperText={error?.message}
    //   inputProps={{
    //     maxLength: 12,
    //   }}
    //   InputProps={{
    //     startAdornment: (
    //       <>
    //         <InputAdornment sx={{ mr: 0 }} position="start">
    //           <IconButton disableRipple edge="start">
    //             <Icon fontSize="1.25rem" icon={"flag:vn-4x3"} />
    //           </IconButton>
    //         </InputAdornment>
    //         <Divider
    //           sx={{ mr: 1 }}
    //           orientation="vertical"
    //           variant="middle"
    //           flexItem
    //         />
    //       </>
    //     ),
    //   }}
    //   {...rest}
    // />
    null
  );
};
export default PhoneInput;
