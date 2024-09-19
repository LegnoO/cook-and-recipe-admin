// ** React Imports
import { ReactNode, memo, Fragment } from "react";

// ** Mui Imports
import { Grid, InputAdornment, IconButton, MenuItem } from "@mui/material";

// ** Components
import { Icon, TextField, DatePicker } from "@/components/ui";

// ** Library
import dayjs, { Dayjs } from "dayjs";
import { Controller, Control } from "react-hook-form";

// ** Types
import { FormField, ResponsiveSize } from "@/types/form-field";

type RenderFieldsProps = {
  field: FormField;
  control: Control<any>;
};

const Fields = ({ field, control }: RenderFieldsProps) => {
  const {
    name,
    type,
    label,
    placeholder,
    disabled,
    icon,
    children,
    size,
    space,
  } = field;

  const renderGridItem = (content: ReactNode) => {
    return (
      <Grid item md={size?.md} xs={size?.xs || 12}>
        {content}
      </Grid>
    );
  };

  const SpaceField = () => {
    if (!space) {
      return <></>;
    }

    const { md, xs } = space as ResponsiveSize;
    return <Grid item md={md} xs={xs} />;
  };

  const DateField = () => {
    return renderGridItem(
      <Controller
        name={name as string}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <DatePicker
            disabled={disabled}
            value={value ? dayjs(value) : null}
            onChange={(date: Dayjs | null) => {
              onChange(date ? date.toISOString() : null);
            }}
            slots={{
              textField: TextField,
            }}
            slotProps={{
              textField: {
                label: label,
                fullWidth: true,
                helperText: error ? error.message : null,
                error: !!error,
              },
            }}
          />
        )}
      />,
    );
  };

  const InputField = () => {
    return renderGridItem(
      <Controller
        name={name as string}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            fullWidth
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            variant="outlined"
            value={value || ""}
            onChange={onChange}
            error={Boolean(error)}
            helperText={error?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <Icon fontSize="1.25rem" icon={icon || ""} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />,
    );
  };

  const SelectField = () => {
    return renderGridItem(
      <Controller
        name={name as string}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            select
            fullWidth
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            error={Boolean(error)}
            helperText={error?.message}
            SelectProps={{
              value: value || "",
              onChange,
            }}>
            <MenuItem value={value.label}>{value.value}</MenuItem>
          </TextField>
        )}
      />,
    );
  };

  if (type === "space") {
    return <SpaceField />;
  }

  if (type === "date") {
    return <DateField />;
  }

  if (type === "input") {
    return <InputField />;
  }

  if (type === "select") {
    return <SelectField />;
  }

  if (type === "children" && children) {
    return (
      <>
        {children.map((field, index) => (
          <Fragment key={index}>
            <Fields field={field} control={control} />
          </Fragment>
        ))}
      </>
    );
  }

  return null;
};

export default memo(Fields);
