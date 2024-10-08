// ** React Imports
import { Dispatch, SetStateAction } from "react";

// ** Mui Imports
import { Stack, Typography, TableCell, SxProps } from "@mui/material";

// ** Components
import { TableRow, TableHead as TableHeadMui, Icon } from "@/components/ui";

// ** Types
type HeadColumns = { sortName?: string; title: string | null; sx?: SxProps };

type Props<T> = {
  filter: Filter<T>;
  setFilter: Dispatch<SetStateAction<Filter<T>>>;
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

    if (filter.sortBy === sortName) {
      const nextSortOrder = sortOrderCycle[filter.sortOrder];

      return nextSortOrder;
    }

    return "desc";
  }

  function handleSortColumn(sortName?: string) {
    if (!sortName) return;

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
        {headColumns.map((column, index) => (
          <TableCell key={index} sx={{ ...column.sx }}>
            <Stack
              sx={{
                cursor:
                  !isLoading && column.sortName !== "" ? "pointer" : "auto",
                width: "fit-content",
              }}
              direction="row"
              alignItems="center"
              spacing={1}
              onClick={() => {
                !isLoading && handleSortColumn(column.sortName);
              }}>
              <Typography
                variant="body2"
                sx={{ color: (theme) => theme.palette.text.primary }}>
                {column.title}
              </Typography>

              <Icon
                fontSize="1rem"
                icon={getSortIcon(
                  filter.sortOrder as SortOrder,
                  column.sortName,
                  filter.sortBy,
                )}
              />
            </Stack>
          </TableCell>
        ))}
      </TableRow>
    </TableHeadMui>
  );
};
export default TableHead;
