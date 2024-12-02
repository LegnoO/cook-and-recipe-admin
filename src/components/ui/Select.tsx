// ** React Imports
import { forwardRef } from "react";

// ** Mui Imports
import {
  TextFieldProps,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";

// ** Components
import { TextField, Icon } from "@/components/ui";

// ** Utils
import { hexToRGBA } from "@/utils/helpers";

// ** Types
type Props = Select & TextFieldProps;

const Select = forwardRef(
  (
    {
      isLoading = false,
      menuItems = [],
      endIcon,
      startIcon,
      defaultOption,
      disableDefaultOption = false,
      disabled,
      SelectProps,
      sx,
      ...rest
    }: Props,
    ref,
  ) => {
    return (
      <TextField
        ref={ref}
        select
        defaultValue=""
        variant="outlined"
        sx={{ "& .MuiFormLabel-root": { overflow: "visible" }, ...sx }}
        SelectProps={{
          displayEmpty: true,
          disabled: disabled || isLoading,
          MenuProps: {
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root.Mui-selected": {
                  backgroundColor: (theme) =>
                    hexToRGBA(theme.palette.primary.main, 0.16),
                  color: (theme) => theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: (theme) =>
                      hexToRGBA(theme.palette.primary.main, 0.24),
                  },
                },
                "& .MuiMenuItem-root": {
                  color: (theme) => theme.palette.text.primary,
                  marginInline: "0.5rem",
                  paddingBlock: "0.5rem",
                  paddingInline: "1rem",
                  borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                },

                "& .MuiList-root .MuiMenuItem-root:not(:last-of-type)": {
                  marginBlockEnd: "0.2rem",
                },
              },
            },
          },
          ...SelectProps,
        }}
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
          <MenuItem value="" disabled={isLoading || disableDefaultOption}>
            {defaultOption}
          </MenuItem>
        )}

        {menuItems.length > 0 &&
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
  },
);
export default Select;
