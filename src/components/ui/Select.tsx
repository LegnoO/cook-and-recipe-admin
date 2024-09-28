// ** Mui Imports
import {
  TextFieldProps,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";

// ** Components
import { TextField, Icon } from "@/components/ui";

// ** Types
type Props = Select & TextFieldProps;

const Select = (props: Props) => {
  const {
    isLoading = false,
    menuItems = [],
    endIcon,
    startIcon,
    defaultOption,
    disableDefaultOption = false,
    ...rest
  } = props;
  return (
    <TextField
      defaultValue={defaultOption && ""}
      select
      variant="outlined"
      InputProps={{
        endAdornment: endIcon ? (
          <InputAdornment position="end">
            <IconButton edge="end">
              <Icon fontSize="1.25rem" icon={endIcon} />
            </IconButton>
          </InputAdornment>
        ) : undefined,
        startAdornment: startIcon ? (
          <InputAdornment position="end">
            <IconButton edge="end">
              <Icon fontSize="1.25rem" icon={startIcon} />
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      {...rest}>
      {defaultOption && (
        <MenuItem value="" disabled={disableDefaultOption}>
          {defaultOption}
        </MenuItem>
      )}

      {isLoading && <MenuItem disabled>Loading...</MenuItem>}

      {!isLoading &&
        menuItems.length > 0 &&
        menuItems?.map((item, index) =>
          typeof item === "string" ? (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ) : (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          ),
        )}

      {!isLoading && menuItems.length === 0 && (
        <MenuItem disabled>No Data Available</MenuItem>
      )}
    </TextField>
  );
};
export default Select;
