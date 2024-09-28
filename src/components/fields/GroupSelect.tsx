// ** React Imports
import { Fragment, useMemo } from "react";

// ** Mui Imports
import { TextFieldProps } from "@mui/material";

// ** Components
import { Select } from "@/components/ui";
import { RenderIf } from "@/components";

// ** Library
import { useQuery } from "@tanstack/react-query";
import { Controller, Control } from "react-hook-form";

// ** Config
import { queryOptions } from "@/config/query-options";
import { getAllGroups } from "@/services/groupServices";

// ** Types
type Props = {
  control?: Control<any>;
} & TextFieldProps &
  Select;

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
    <Fragment>
      <RenderIf condition={Boolean(control)}>
        <Controller
          name={name as string}
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Select
              id="group-id-select"
              value={value}
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
      </RenderIf>
      <RenderIf condition={Boolean(!control)}>
        <Select
          id="group-id-select"
          name={name}
          isLoading={isLoading}
          menuItems={menuItems}
          // error={Boolean(error)}
          // helperText={error?.message}
          disableDefaultOption={false}
          {...rest}
        />
      </RenderIf>
    </Fragment>
  );
};
export default GroupSelect;
