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

// ** Styled Components
export const Table = styled(MuiTable)({});

export const TableRow = styled(MuiTableRow)({
  "&.MuiTableRow-head": {
    borderBottom: 0,
  },
});

export const TableContainer = styled(MuiTableContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
}));

export const TableHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.action.selected
      : theme.palette.background.paper,
}));

export const TableBody = styled(MuiTableBody)({
  "& .MuiTableRow-root .MuiTableCell-root:has(.no-data-found)": {
    background: "red",
  },
});

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
  "&": {
    color: theme.palette.text.secondary,
    lineHeight: "1.5",
  },
  "&.MuiTableCell-head": {
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: 600,
    borderBottom: 0,
  },
  "&.MuiTableCell-body": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "&:has(.MuiCheckbox-root)": {
    padding: "0 0 0 0.5rem",
  },
}));

export const TableFooter = styled(MuiTableFooter)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.action.selected
      : theme.palette.background.paper,
}));

// export const TablePagination = styled(MuiTablePagination)({
//   "& .MuiTablePagination-toolbar": {
//     fontSize: "0.875rem",
//     lineHeight: "1.5",
//   },
// });
