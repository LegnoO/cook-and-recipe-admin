// ** React Imports
import { ChangeEvent } from "react";

// ** Mui Imports
import {
  Stack,
  Typography,
  Pagination as MuiPagination,
  Box,
} from "@mui/material";

// ** Types
type Props = {
  paginatePage: number;
  paginateCount: number;
  isLoading?: boolean;
  dataLength?: number;
  handlePaginateChange: (event: ChangeEvent<unknown>, value: number) => void;
};

const Pagination = ({
  handlePaginateChange,
  paginatePage,
  paginateCount,
  isLoading,
  dataLength,
}: Props) => {
  return (
    <>
      <Stack
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          width: "100%",
          backgroundColor: (theme) => theme.palette.background.paper,
          paddingBlock: "1rem",
          paddingInline: "1.5rem",
        }}
        direction={{ xs: "column", md: "row" }}
        alignItems={"center"}
        justifyContent={dataLength ? "space-between" : "end"}
        spacing={2}>
        {dataLength && (
          <Typography color="secondary">
            Showing 1 to {dataLength} of {dataLength} entries
          </Typography>
        )}

        <MuiPagination
          color="primary"
          disabled={isLoading}
          count={paginateCount}
          page={paginatePage || 0}
          onChange={handlePaginateChange}
          showFirstButton
          showLastButton
        />
      </Stack>
      <Box
        sx={{
          height: "1px",
          width: "100%",
          boxShadow: (theme) => theme.shadows[1],
        }}
      />
    </>
  );
};
export default Pagination;
