// ** React Imports
import { Fragment, forwardRef } from "react";

// ** Mui Imports
import {
  IconButton,
  InputAdornment,
  Divider,
  TextFieldProps,
} from "@mui/material";

// ** Components
import { TextField, Icon } from "@/components/ui";

const PhoneInput = forwardRef(({ ...props }: TextFieldProps, ref) => {
  return (
    <TextField
      ref={ref}
      variant="outlined"
      inputProps={{
        maxLength: 12,
      }}
      InputProps={{
        startAdornment: (
          <Fragment>
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
          </Fragment>
        ),
      }}
      {...props}
    />
  );
});
export default PhoneInput;
