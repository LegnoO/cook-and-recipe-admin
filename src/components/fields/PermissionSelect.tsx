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
import { getPermissions } from "@/services/permissionServices";

// ** Types
type Props = {
  control?: Control<any>;
} & TextFieldProps &
  Select;

const PermissionSelect = ({ name, control, ...rest }: Props) => {
  const { isLoading, data } = useQuery({
    queryKey: ["all-permission"],
    queryFn: getPermissions,
    ...queryOptions,
  });

  const menuItems = useMemo(() => {
    return data
      ? data.map((permission) => ({
          value: JSON.stringify(permission),
          label: permission.page,
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
              value={value || ""}
              onChange={onChange}
              isLoading={isLoading}
              menuItems={menuItems}
              error={Boolean(error)}
              helperText={error?.message}
              disableDefaultOption={false}
              SelectProps={{
                multiple: true,
              }}
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
          value={[]}
          // error={Boolean(error)}
          // helperText={error?.message}
          disableDefaultOption={false}
          SelectProps={{
            multiple: true,
          }}
          {...rest}
        />
      </RenderIf>
    </Fragment>
  );
};
export default PermissionSelect;
