// ** React Imports
import { ChangeEvent } from "react";

// ** Mui Imports
import { Stack, Typography, Pagination } from "@mui/material";

// ** Components
import {
  TableCell,
  TableRow,
  TableFooter as TableFooterMui,
} from "@/components/ui";

// ** Types
type Props = {
  paginatePage: number;
  paginateCount: number;
  isLoading?: boolean;
  dataLength?: number;
  handlePaginateChange: (event: ChangeEvent<unknown>, value: number) => void;
};

const TableFooter = ({
  handlePaginateChange,
  paginatePage,
  paginateCount,
  isLoading,
  dataLength,
}: Props) => {
  return (
    <TableFooterMui>
      <TableRow>
        <TableCell colSpan={99}>
          <Stack
            sx={{ padding: "0.78125rem 0.75rem" }}
            direction={{ xs: "column", md: "row" }}
            justifyContent={"space-between"}
            alignItems={{ xs: "start", sm: "center" }}
            spacing={2}>
            {dataLength && (
              <Typography color="secondary">
                Showing 1 to {dataLength} of {dataLength} entries
              </Typography>
            )}
            <Pagination
              color="primary"
              disabled={isLoading}
              count={paginateCount}
              page={paginatePage || 0}
              onChange={handlePaginateChange}
              showFirstButton
              showLastButton
            />
          </Stack>
        </TableCell>
      </TableRow>
    </TableFooterMui>
  );
};
export default TableFooter;
