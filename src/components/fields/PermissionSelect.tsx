// ** React Imports
import { Fragment, useMemo } from "react";

// ** Mui Imports
import { Typography, TextFieldProps } from "@mui/material";

// ** Components
import { RenderIf } from "@/components";

// ** Library
import { useQuery } from "@tanstack/react-query";
import { Control } from "react-hook-form";

// ** Config
import { queryOptions } from "@/config/query-options";
import { getPermissions } from "@/services/permissionServices";
import SelectMultiple from "../ui/SelectMultiple";

// ** Types
type Props = {
  control?: Control<any>;
  value: PagePermissions[];
} & TextFieldProps &
  Select;

const PermissionSelect = ({ value, name, control, ...rest }: Props) => {
  const { isLoading, data } = useQuery({
    queryKey: ["all-permission"],
    queryFn: getPermissions,
    ...queryOptions,
  });

  const menuItems = useMemo(() => {
    return data
      ? data.map((permission) => ({
          value: permission,
          label: permission.page,
        }))
      : [];
  }, [data]);

  return (
    <Fragment>
      {/* <RenderIf condition={Boolean(control)}>
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
              SelectProps={{
                multiple: true,
              }}
              {...rest}
            />
          )}
        />
      </RenderIf> */}
      <RenderIf condition={Boolean(!control)}>
        <SelectMultiple
          jsonValue
          id="select-permission"
          name={name}
          isLoading={isLoading}
          menuItems={menuItems}
          value={value || []}
          // error={Boolean(error)}
          // helperText={error?.message}
          SelectProps={{
            multiple: true,
            renderValue: (selected: any) => {
              if (!selected || selected.length === 0) {
                return (
                  <Typography variant="body1" color="text.secondary">
                    Select Permission
                  </Typography>
                );
              }
              return selected
                .map((permission: any) => permission.page)
                .join(", ");
            },
          }}
          {...rest}
        />
      </RenderIf>
    </Fragment>
  );
};
export default PermissionSelect;
