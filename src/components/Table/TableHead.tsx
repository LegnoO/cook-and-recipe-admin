// ** React Imports
import { Dispatch, SetStateAction } from "react";

// ** Mui Imports
import { Stack, Typography, TableCell, SxProps } from "@mui/material";

// ** Components
import { TableRow, TableHead as TableHeadMui, Icon } from "@/components/ui";

// ** Types
type HeadColumns = { sortName?: string; title: string | null; sx?: SxProps };
type SortOrder = "" | "1" | "-1";

type Props = {
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  headColumns: HeadColumns[];
  isLoading?: boolean;
};

const TableHead = ({ headColumns, filter, setFilter, isLoading }: Props) => {
  function handleSortOrder(sortName: string) {
    const sortOrderCycle = { "": 1, "1": -1, "-1": "" } as const;
    if (filter.sortBy === sortName) {
      const nextSortOrder = sortOrderCycle[filter.sortOrder];

      return nextSortOrder;
    }

    return 1;
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
    sortBy?: string | null,
  ) {
    if (!sortName) return "";

    const icons = {
      "": "vaadin:sort",
      "1": "typcn:arrow-sorted-up",
      "-1": "typcn:arrow-sorted-down",
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
                cursor: !isLoading ? "pointer" : "auto",
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
                  String(filter.sortOrder) as SortOrder,
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
