// ** React Imports
import {} from "react";

// ** Mui Imports
import { IconButton, InputAdornment, TextFieldProps } from "@mui/material";

// ** Components
import { Icon, TextField } from "@/components/ui";

// ** Types
type Props = {} & TextFieldProps;

const SearchInput = ({ ...rest }: Props) => {
  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton disableRipple edge="start">
              <Icon fontSize="1.25rem" icon={"basil:search-outline"} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
};
export default SearchInput;
