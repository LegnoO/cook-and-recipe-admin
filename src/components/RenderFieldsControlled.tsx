// ** React Imports
import { Fragment, ReactNode } from "react";

// ** Mui Imports
import { Grid, InputAdornment, IconButton } from "@mui/material";

// ** Components
import { Icon, TextField, DatePicker, Select } from "@/components/ui";

// ** Library Imports
import dayjs, { Dayjs } from "dayjs";
import { Controller, Path, UseFormReturn, FieldValues } from "react-hook-form";

// ** Types
type Props<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  id: string;
  field: FormField;
};

const RenderFieldsControlled = <T extends FieldValues>({
  field,
  form,
  id,
  name,
}: Props<T>) => {
  const {
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

  const RenderChildren = <T extends FieldValues>({
    children,
    form,
  }: {
    children: FormField[];
    form: UseFormReturn<T>;
  }) =>
    children.map((field, index) => (
      <Fragment key={index}>
        <RenderFieldsControlled<T>
          id={String(index)}
          name={field.name as Path<T>}
          field={field}
          form={form}
        />
      </Fragment>
    ));

  const DateField = () => {
    return renderGridItem(
      <Controller
        name={name}
        control={form.control}
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
        name={name}
        control={form.control}
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
        name={name}
        control={form.control}
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
    children: <RenderChildren children={children || []} form={form} />,
  };

  return types[type];
};

export default RenderFieldsControlled;
