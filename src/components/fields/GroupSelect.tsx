// ** React Imports
import { useMemo, forwardRef } from "react";

// ** Mui Imports
import { TextFieldProps } from "@mui/material";

// ** Components
import { Select } from "@/components/ui";

// ** Library
import { useQuery } from "@tanstack/react-query";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { getActiveGroup } from "@/services/groupServices";

// ** Types
type Props = TextFieldProps & Select;

const GroupSelect = forwardRef(({ ...props }: Props, ref) => {
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

  return (
    <Select
      ref={ref}
      isLoading={isLoading}
      menuItems={menuItems}
      disableDefaultOption={false}
      {...props}
    />
  );
});

export default GroupSelect;
