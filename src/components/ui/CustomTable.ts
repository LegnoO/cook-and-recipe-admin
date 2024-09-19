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

export const TableRow = styled(MuiTableRow)({
  "&.MuiTableRow-head": {
    borderBottom: 0,
  },
});

export const TableContainer = styled(MuiTableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderBottomRightRadius: `${theme.shape.borderRadius}px`,
  borderBottomLeftRadius: `${theme.shape.borderRadius}px`,
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
  "& .MuiTableRow-root .MuiTableCell-root:has(.no-data-found)": {},
}));

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
  "&": {
    color: theme.palette.text.primary,
    lineHeight: "1.5",
  },
  "&.MuiTableCell-head": {
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: 500,
    borderBottom: 0,
    padding: "1.25rem",
  },
  "&.MuiTableCell-body": {
    paddingBlock: "0.75rem",
    paddingInline: "1.25rem",
    borderBottom: `1px solid ${theme.palette.divider} !important`,
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
