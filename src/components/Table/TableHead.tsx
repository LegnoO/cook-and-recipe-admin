// ** React Imports
import { Dispatch, SetStateAction } from "react";

// ** Mui Imports
import { Stack, Typography, TableCell } from "@mui/material";

// ** Components
import { TableRow, TableHead as TableHeadMui, Icon } from "@/components/ui";

// ** Types
type HeadColumns = { sortName: string; title: string | null };

type Props<T> = {
  filter?: Filter<T>;
  setFilter?: Dispatch<SetStateAction<Filter<T>>>;
  headColumns: HeadColumns[];
  isLoading?: boolean;
};

const TableHead = <T,>({
  headColumns,
  filter,
  setFilter,
  isLoading,
}: Props<T>) => {
  function handleSortOrder(sortName: string) {
    const sortOrderCycle = { "": "desc", desc: "asc", asc: "" } as const;

    if (filter?.sortBy === sortName) {
      const nextSortOrder = sortOrderCycle[filter?.sortOrder];

      return nextSortOrder;
    }

    return "desc";
  }

  function handleSortColumn(sortName?: string) {
    if (!sortName || !setFilter || !filter) return;

    setFilter((prev) => ({
      ...prev,
      sortOrder: handleSortOrder(sortName),
      sortBy: handleSortOrder(sortName) !== "" ? sortName : "",
    }));
  }

  function getSortIcon(
    sortOrder: SortOrder,
    sortName?: string,
    sortBy?: string,
  ) {
    if (!sortName) return "";

    const icons = {
      "": "vaadin:sort",
      asc: "typcn:arrow-sorted-up",
      desc: "typcn:arrow-sorted-down",
    };

    return sortName === sortBy ? icons[sortOrder] : "vaadin:sort";
  }

  return (
    <TableHeadMui>
      <TableRow>
        {headColumns.map(({ sortName, title }, index) => (
          <TableCell sx={{}} key={index}>
            <Stack
              sx={{
                cursor: !isLoading && sortName !== "" ? "pointer" : "auto",
              }}
              direction="row"
              alignItems="center"
              spacing={0.25}
              onClick={() => {
                !isLoading && handleSortColumn(sortName);
              }}>
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.text.primary,
                }}>
                {title}
              </Typography>

              {filter && setFilter && (
                <Icon
                  fontSize="1rem"
                  icon={getSortIcon(
                    filter.sortOrder as SortOrder,
                    sortName,
                    filter.sortBy,
                  )}
                />
              )}
            </Stack>
          </TableCell>
        ))}
      </TableRow>
    </TableHeadMui>
  );
};
export default TableHead;
