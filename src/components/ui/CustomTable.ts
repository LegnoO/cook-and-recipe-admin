// ** MUI Imports
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

export const TableRow = styled(MuiTableRow)({
  "&.MuiTableRow-head": {
    borderBottom: 0,
  },
});

export const TableContainer = styled(MuiTableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
}));

export const TableHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.action.selected
      : hexToRGBA(theme.palette.background.paper, 1, 15),
}));

export const TableBody = styled(MuiTableBody)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.background.paper,
  },
  "& .MuiTableRow-root .MuiTableCell-root:has(.no-data-found)": {
    background: "red",
  },
}));

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
  "&": {
    color: theme.palette.text.secondary,
    lineHeight: "1.5",
  },
  "&.MuiTableCell-head": {
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: 600,
    borderBottom: 0,
    padding: "1.25rem",
  },
  "&.MuiTableCell-body": {
    padding: "0.75rem",
    borderBottom: `1px dashed ${theme.palette.divider} !important`,
  },
  "&.MuiTableCell-footer": {
    padding: "0.5rem",
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
