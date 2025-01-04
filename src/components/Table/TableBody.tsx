// ** React Imports
import { Fragment } from "react";

// ** Mui Imports
import { Skeleton } from "@mui/material";

// ** Components
import {
  TableCell,
  TableRow,
  TableBody as TableBodyMui,
  EmptyData,
} from "@/components/ui";
import { Repeat } from "@/components";

// ** Types
type Props<T, V> = {
  bodyCells: BodyCell<T>[];
  isLoading: boolean;
  filter?: Filter<V>;
  data?: T[];
  size?: number;
};

const TableBody = <T, V>({
  data,
  bodyCells,
  filter,
  isLoading,
  size,
}: Props<T, V>) => {
  const renderDataRows = (data: T[]) => {
    return data?.map((row, index) => (
      <TableRow
        key={index}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}>
        {bodyCells.map(({ align, render }, index) => (
          <TableCell align={align} key={index}>
            {render(row)}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const renderLoadingRows = () => {
    return (
      <Repeat times={filter?.size || size || 1}>
        <TableRow>
          <Repeat times={bodyCells.length}>
            <TableCell sx={{ height: 68.5 }}>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            </TableCell>
          </Repeat>
        </TableRow>
      </Repeat>
    );
  };

  const renderDataEmpty = () => {
    return (
      <TableRow>
        <TableCell colSpan={bodyCells.length} align="center">
          <EmptyData />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableBodyMui>
      <Fragment>
        {!isLoading && data && data.length > 0 && renderDataRows(data as T[])}

        {(isLoading || !data) && renderLoadingRows()}

        {!isLoading && data && data.length === 0 && renderDataEmpty()}
      </Fragment>
    </TableBodyMui>
  );
};
export default TableBody;
