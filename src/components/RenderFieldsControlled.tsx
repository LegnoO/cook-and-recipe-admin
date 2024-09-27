// ** React Imports
import { ReactNode, memo } from "react";

// ** Mui Imports
import { Grid, InputAdornment, IconButton } from "@mui/material";

// ** Components
import { Icon, TextField, DatePicker, Select } from "@/components/ui";
import { RenderIf } from "@/components";

// ** Library Imports
import { Controller, Control } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";

// ** Types
type RenderFieldsProps = {
  id: string;
  field: FormField;
  control: Control<any>;
};

const RenderFieldsControlled = ({ field, control, id }: RenderFieldsProps) => {
  const {
    name,
    type,
    label,
    placeholder,
    disabled,
    icon,
    children,
    size,
    menuItems,
    required,
  } = field;

  const renderGridItem = (content: ReactNode) => {
    return (
      <Grid item md={size?.md} xs={size?.xs || 12}>
        {content}
      </Grid>
    );
  };

  const Children = () => {
    return (
      <RenderIf condition={Boolean(children)} fallback={<></>}>
        {children?.map((field, index) => (
          <RenderFieldsControlled
            key={String(index)}
            field={field}
            control={control}
            id={String(index)}
          />
        ))}
      </RenderIf>
    );
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
                required,
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
            required={required}
            id={id}
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
          <Select
            fullWidth
            required={required}
            label={label}
            disabled={disabled}
            value={value || ""}
            onChange={onChange}
            error={Boolean(error)}
            helperText={error?.message}
            menuItems={menuItems}
          />
        )}
      />,
    );
  };

  const types = {
    date: <DateField />,
    input: <InputField />,
    select: <SelectField />,
    children: <Children />,
  };

  return types[type];
};

export default memo(RenderFieldsControlled);
