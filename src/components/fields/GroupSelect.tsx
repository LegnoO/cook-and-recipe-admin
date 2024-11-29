// ** React Imports
import { useMemo } from "react";

// ** Mui Imports
import { TextFieldProps } from "@mui/material";

// ** Components
import { Select } from "@/components/ui";

// ** Library
import { useQuery } from "@tanstack/react-query";
import { Controller, UseFormReturn, FieldValues, Path } from "react-hook-form";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { getActiveGroup } from "@/services/groupServices";

// ** Types
type Props<T extends FieldValues> = {
  form?: UseFormReturn<T>;
  name: Path<T>;
} & Omit<TextFieldProps, "name"> &
  Omit<Select, "name">;

const GroupSelect = <T extends FieldValues>({
  form,
  value,
  name,
  ...rest
}: Props<T>) => {
  const { isLoading, data } = useQuery({
    queryKey: ["all-groups-active"],
    queryFn: getActiveGroup,
    ...queryOptions,
  });

  const menuItems = useMemo(() => {
    return data
      ? data.map((group) => ({
          value: group._id,
          label: group.name,
        }))
      : [];
  }, [data]);

  if (form) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            id="group-form-id-select"
            value={value || ""}
            onChange={onChange}
            isLoading={isLoading}
            menuItems={menuItems}
            error={Boolean(error)}
            helperText={error?.message}
            disableDefaultOption={false}
            {...rest}
          />
        )}
      />
    );
  }

  return (
    <Select
      id="group-id-select"
      name={name}
      value={data && value ? value : ""}
      isLoading={isLoading}
      menuItems={menuItems}
      disableDefaultOption={false}
      {...rest}
    />
  );
};
export default GroupSelect;
