// ** React
import { useState, MouseEvent, useEffect } from "react";

// ** Third Pary Imports
import { useQuery } from "@tanstack/react-query";

// ** Mui Imports
import {
  Box,
  IconButton,
  MenuItem,
  Stack,
  Avatar,
  Skeleton,
  Checkbox,
  Typography,
  TablePagination,
  Fade,
  Button,
} from "@mui/material";

// ** Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Menu,
  Image,
  Icon,
  Modal,
  Paper,
} from "@/components/ui";
import RenderIf from "@/components/RenderIf";
import Switches from "@/components/Switches";

// ** Assets
import NoDataIcon from "@/assets/ic-content.svg";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import UpdateEmployee from "./UpdateEmployee";
import AddEmployee from "./AddEmployee";

// ** Hooks
import { useSettings } from "@/hooks/useSettings";

// ** Utils
import {
  getFilterEmployee,
  toggleStatusEmployee,
} from "@/utils/services/userService";
import { formatAddress } from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

const EmployeeListPage = () => {
  const { listModal, handleOpenModal, handleCloseModal } = useSettings();
  const [activeMenuAction, setActiveMenuAction] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isLoading, data: dataEmployee } = useQuery({
    queryKey: ["list-employee"],
    queryFn: getFilterEmployee,
    ...queryOptions,
  });

  const [checkedStatus, setCheckedStatus] = useState<string[]>([]);

  const createRowData = (employeeList: ListEmployees) => ({
    ...employeeList,
  });

  const rows = dataEmployee
    ? dataEmployee.map((data) => createRowData(data))
    : [];

  function handleCloseMenu(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    setActiveMenuAction(null);
  }

  function handleToggleMenu(event: MouseEvent<HTMLElement>, id: string) {
    setAnchorEl(event.currentTarget);

    setActiveMenuAction((prevId) => (prevId === id ? null : id));
  }

  async function handleChangeStatus(employeeId: string) {
    try {
      await toggleStatusEmployee(employeeId);
      setCheckedStatus((prev) =>
        prev.includes(employeeId)
          ? prev.filter((id) => id !== employeeId)
          : [...prev, employeeId],
      );
    } catch (error) {
      setCheckedStatus((prev) => prev.filter((id) => id !== employeeId));
      handleAxiosError(error);
    }
  }

  function handleChangePage() {}
  function handleChangeRowsPerPage() {}

  useEffect(() => {
    if (dataEmployee) {
      setCheckedStatus(dataEmployee.map((data) => data.id));
    }
  }, [dataEmployee]);

  const ActionMenu = ({ id }: { id: string }) => (
    <Menu
      TransitionComponent={Fade}
      closeAfterTransition
      TransitionProps={{
        timeout: {
          enter: 350,
          exit: 350,
        },
      }}
      onClose={handleCloseMenu}
      anchorEl={anchorEl}
      open={Boolean(anchorEl) && activeMenuAction === id}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}>
      <MenuItem
        sx={{
          borderRadius: (theme) => `${theme.shape.borderRadius}px`,
          marginInline: "0.5rem",
          paddingInline: "1rem",
          paddingBlock: "0.5rem",
          gap: "0.5rem",
        }}>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: 15,
            gap: "0.5rem",
          }}
          variant="caption"
          color="text.secondary">
          <Icon icon="tabler-edit" />
          Edit
        </Typography>
      </MenuItem>
      <MenuItem
        sx={{
          borderRadius: (theme) => `${theme.shape.borderRadius}px`,
          marginInline: "0.5rem",
          paddingInline: "1rem",
          paddingBlock: "0.5rem",
          gap: "0.5rem",
        }}>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: 15,
            gap: "0.5rem",
          }}
          variant="caption"
          color="error">
          <Icon icon="tabler-trash" />
          Delete
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <TableContainer>
      <Paper sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Button variant="contained">test</Button>
          </Box>

          <Box>
            <Button
              disableRipple
              variant="contained"
              startIcon={<Icon icon="ic:sharp-plus" />}
              onClick={() => handleOpenModal("new-employee")}>
              Add New Employee
              <Modal
                open={listModal.includes("new-employee")}
                onClose={() => handleCloseModal("new-employee")}>
                <AddEmployee
                  closeMenu={() => handleCloseModal("new-employee")}
                />
              </Modal>
            </Button>
          </Box>
        </Stack>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 0, paddingRight: 0 }}>
              <Checkbox />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone number</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell sx={{ width: "75px" }}>{null}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <RenderIf condition={!isLoading && rows.length > 0}>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}>
                <TableCell sx={{ width: 0, paddingRight: 0 }}>
                  <Checkbox />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack direction="row" spacing={2} alignItems={"center"}>
                    <Avatar src={row.avatar} alt="test" />
                    <Stack direction="column">
                      <Typography fontWeight="500" color="text.primary">
                        {row.fullName}
                      </Typography>
                      <Typography color="text.secondary">
                        {row.email}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{formatAddress(row.address, 26)}</TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell>
                  <Switches
                    onChange={async () => {
                      await handleChangeStatus(row.id);
                    }}
                    checked={checkedStatus.includes(row.id)}
                    color={"success"}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0}>
                    <IconButton onClick={() => handleOpenModal(row.id)}>
                      <Icon icon="heroicons:pencil-solid" />
                      <Modal
                        open={listModal.includes(row.id)}
                        onClose={() => handleCloseModal(row.id)}>
                        <UpdateEmployee
                          closeMenu={() => handleCloseModal(row.id)}
                          employeeData={row}
                        />
                      </Modal>
                    </IconButton>
                    <IconButton
                      onClick={(event: MouseEvent<HTMLElement>) =>
                        handleToggleMenu(event, row.id)
                      }>
                      <Icon icon="mingcute:more-2-fill" />
                    </IconButton>
                  </Stack>
                  <ActionMenu id={row.id} />
                </TableCell>
              </TableRow>
            ))}
          </RenderIf>

          <RenderIf condition={isLoading}>
            <TableRow>
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
              </TableCell>
              <TableCell align="right">
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </TableCell>
            </TableRow>
          </RenderIf>

          <RenderIf condition={!isLoading && rows.length === 0}>
            <TableRow>
              <TableCell colSpan={99} align="center">
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
          </RenderIf>
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
};
export default EmployeeListPage;
