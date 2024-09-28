// ** Mui Imports
import { TableCell, SxProps } from "@mui/material";

// ** Components
import { TableRow, TableHead as TableHeadMui } from "@/components/ui";

// ** Types
type Props = { headColumns: { title: string | null; sx?: SxProps }[] };

const TableHead = ({ headColumns }: Props) => {
  return (
    <TableHeadMui>
      <TableRow>
        {headColumns.map(({ title, sx = {} }, index) => (
          <TableCell key={index} sx={sx}>
            {title}
          </TableCell>
        ))}
      </TableRow>
    </TableHeadMui>
  );
};
export default TableHead;
