// ** Mui Imports
import { styled } from "@mui/material/styles";
import {
  Table as MuiTable,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableFooter as MuiTableFooter,
  TableRow as MuiTableRow,
} from "@mui/material";
import { hexToRGBA } from "@/utils/helpers";

// ** Styled Components
export const Table = styled(MuiTable)({});

export const TableRow = styled(MuiTableRow)({});

export const TableContainer = styled(MuiTableContainer)({});

export const TableHead = styled(MuiTableHead)(({ theme }) => ({
  "&.MuiTableHead-root": {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.action.selected
        : hexToRGBA(theme.palette.background.paper, 1, 15),

    "& .MuiTableRow-head .MuiTableCell-head": {
      fontSize: theme.typography.subtitle2.fontSize,
      fontWeight: 500,
      borderBottom: 0,
      paddingBlock: "1.25rem",
      paddingInline: "1.5rem",
    },
  },
}));

export const TableBody = styled(MuiTableBody)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.background.paper,
  },
  "& .MuiTableRow-root .MuiTableCell-root:has(.no-data-found)": {},
}));

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
  "&.MuiTableCell-body": {
    paddingBlock: "0.75rem",
    paddingInline: "1.5rem",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "&.MuiTableCell-footer": {
    padding: "0.5rem",
    borderBottom: 0,
  },
  "&:has(.MuiCheckbox-root)": {
    padding: "0 0 0 0.5rem",
  },
}));

export const TableFooter = styled(MuiTableFooter)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

// export const TablePagination = styled(MuiTablePagination)({
//   "& .MuiTablePagination-toolbar": {
//     fontSize: "0.875rem",
//     lineHeight: "1.5",
//   },
// });
