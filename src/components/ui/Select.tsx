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
type Props = {
  isLoading?: boolean;
  menuItems?: MenuItem[];
  endIcon?: string;
  startIcon?: string;
  defaultOption?: string;
  disableDefaultOption?: boolean;
} & TextFieldProps;

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
      {isLoading && <MenuItem disabled>Loading...</MenuItem>}
      {!isLoading && menuItems.length > 0 && defaultOption && (
        <MenuItem disabled={disableDefaultOption}>{defaultOption}</MenuItem>
      )}

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
