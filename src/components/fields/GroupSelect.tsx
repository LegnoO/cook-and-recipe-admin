// ** React Imports
import { useMemo } from "react";

// ** Mui Imports
import { TextFieldProps } from "@mui/material";

// ** Components
import { Select } from "@/components/ui";

// ** Library
import { useQuery } from "@tanstack/react-query";
import { Controller, Control } from "react-hook-form";

// ** Config
import { queryOptions } from "@/config/query-options";
import { getAllGroups } from "@/services/groupServices";

// ** Types
type Props = {
  control: Control<any>;
} & TextFieldProps;

const GroupSelect = ({ name, control, ...rest }: Props) => {
  const { isLoading, data } = useQuery({
    queryKey: ["all-groups"],
    queryFn: getAllGroups,
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

  return (
    <Controller
      name={name as string}
      control={control}
      defaultValue={""}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Select
          value={value}
          onChange={onChange}
          id="group-id-select"
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
};
export default GroupSelect;
