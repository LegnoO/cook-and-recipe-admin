// ** React Imports
import { Fragment, ReactNode } from "react";

// ** Mui Imports
import { Box, Skeleton, Typography } from "@mui/material";

// ** Components
import {
  Image,
  TableCell,
  TableRow,
  TableBody as TableBodyMui,
} from "@/components/ui";
import { RenderIf, Repeat } from "@/components";

// ** Assets
import NoDataIcon from "@/assets/ic-content.svg";

// ** Types
type BodyCell<T> = {
  render: (row: T) => ReactNode;
  width?: string | number;
};

type Props<T,V> = {
  bodyCells: BodyCell<T>[];
  isLoading: boolean;
  filter: Filter<V>;
  data: T[] | null;
};

const TableBody = <T,V>({ data, bodyCells, filter, isLoading }: Props<T,V>) => {
  const renderDataRows = (data: T[]) => {
    return data?.map((row, index) => (
      <TableRow
        key={index}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}>
        {bodyCells.map(({ render, width }, index) => (
          <TableCell sx={{ width }} key={index}>
            {render(row)}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const renderLoadingRows = () => {
    return (
      <Repeat times={filter.size}>
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
          <Box
            className="no-data-found"
            sx={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
              paddingInline: "1.5rem",
              paddingBlock: "4rem",
            }}>
            <Image
              sx={{ mx: "auto" }}
              width="150px"
              height="150px"
              alt="no data icon"
              src={NoDataIcon}
            />
            <Typography
              sx={{ color: (theme) => theme.palette.text.disabled }}
              fontWeight="600"
              variant="subtitle1">
              No Data
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableBodyMui>
      <Fragment>
        <RenderIf condition={!isLoading && data !== null && data.length > 0}>
          {renderDataRows(data as T[])}
        </RenderIf>

        <RenderIf condition={isLoading || data === null}>
          {renderLoadingRows()}
        </RenderIf>

        <RenderIf condition={!isLoading && data !== null && data.length === 0}>
          {renderDataEmpty()}
        </RenderIf>
      </Fragment>
    </TableBodyMui>
  );
};
export default TableBody;
