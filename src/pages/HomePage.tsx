// ** React
import { useState } from "react";

// ** Assets
import NoDataIcon from "@/assets/ic-content.svg";
import MoreFill from "@/assets/mingcute-more-fill.svg?react";

// ** Test
import {
  Box,
  IconButton,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Fade,
} from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Tooltip,
} from "@/components/ui";

// import Paper from "@mui/material/Paper";
import { Checkbox, Typography, TablePagination } from "@mui/material";

import Image from "@/components/ui/Image";
import Icon from "@/components/ui/Icon";

// import { UserInfo } from "./types/UserInfo";

function HomePage() {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const handleCloseTooltip = () => {
    setActiveTooltip(null);
  };

  const handleToggleTooltip = (id: number) => {
    setActiveTooltip(id);
  };

  // const loadingBar = useRef(null);
  // <LoadingBar ref={loadingBar} color="#f11946" />
  // console.log(import.meta.env.VITE_BASE_URL);
  const ActionMenu = () => {
    return (
      <ClickAwayListener onClickAway={handleCloseTooltip}>
        <MenuList sx={{ padding: 0, width: "140px" }}>
          <MenuItem sx={{ gap: "0.75rem", paddingInline: "0.5rem" }}>
            <MoreFill />
            Delete
          </MenuItem>
          <MenuItem sx={{ gap: "0.75rem", paddingInline: "0.5rem" }}>
            <MoreFill />
            Delete
          </MenuItem>
          <MenuItem sx={{ gap: "0.75rem", paddingInline: "0.5rem" }}>
            <MoreFill />
            Delete
          </MenuItem>
        </MenuList>
      </ClickAwayListener>
    );
  };

  const createRowData = (
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) => ({ name, calories, fat, carbs, protein });

  const handleChangePage = () => {};
  const handleChangeRowsPerPage = () => {};

  const rows = [
    createRowData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createRowData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createRowData("Eclair", 262, 16.0, 24, 6.0),
    createRowData("Cupcake", 305, 3.7, 67, 4.3),
    createRowData("Gingerbread", 356, 16.0, 49, 3.9),
    createRowData("Gingerbread", 356, 16.0, 49, 3.9),
    createRowData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 0, paddingRight: 0 }}>
              <Checkbox />
            </TableCell>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
            <TableCell align="right" sx={{ width: "75px" }}>
              {null}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}>
                <TableCell sx={{ width: 0, paddingRight: 0 }}>
                  <Checkbox />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
                <TableCell align="right" sx={{ display: "flex" }}>
                  <Tooltip
                    title={<ActionMenu />}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    placement="left-start"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 200 }}
                    open={activeTooltip === index}
                    arrow>
                    <IconButton onClick={() => handleToggleTooltip(index)}>
                      <Icon icon="mingcute:more-2-fill" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                {/* <TableCell align="right">
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                </TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={99} align="center">
                <Box
                  className="no-data-found"
                  sx={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}>
                  <Image
                    sx={{ mx: "auto" }}
                    width="150px"
                    height="150px"
                    alt="no data icon"
                    src={NoDataIcon}
                  />
                  <Typography variant="subtitle2">No Data Found</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={99}>
              <TablePagination
                rowsPerPageOptions={[4, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={4}
                page={0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default HomePage;
