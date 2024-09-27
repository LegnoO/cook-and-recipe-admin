// ** React Imports
import { ChangeEvent, useState, useEffect } from "react";

// ** Mui Imports
import {
  Box,
  IconButton,
  Stack,
  Avatar,
  Skeleton,
  Typography,
  Button,
  Pagination,
  Tooltip,
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
  Image,
  Icon,
  Modal,
  Paper,
  Select,
  Switch,
} from "@/components/ui";
import { RenderIf, Repeat } from "@/components";

// ** Assets
import NoDataIcon from "@/assets/ic-content.svg";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import UpdateEmployee from "./UpdateEmployee";
import AddEmployee from "./AddEmployee";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import { formatAddress } from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Services
import {
  getFilterEmployee,
  toggleStatusEmployee,
} from "@/services/userService";

// ** Types
type EmployeeStatus = {
  id: string;
  status: boolean;
};
const EmployeeListPage = () => {
  const pageSizeOptions = ["10", "20", "25"];
  const { activeIds, addId, removeId } = useSettings();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [employeeStatus, setEmployeeStatus] = useState<EmployeeStatus[]>([]);
  const [paginate, setPaginate] = useState<Paginate>({
    total: 0,
    index: 1,
    size: Number(pageSizeOptions[0]),
  });

  const { isLoading, data: dataEmployee } = useQuery({
    queryKey: ["list-employee", paginate.index, paginate.size],
    queryFn: () => getFilterEmployee(paginate),
    ...queryOptions,
  });

  async function handleChangeStatus(employeeId: string) {
    try {
      addId(`loading-switch-${employeeId}`);
      await toggleStatusEmployee(employeeId);
      setEmployeeStatus((prev) => {
        return prev.map((employee) =>
          employee.id === employeeId
            ? { ...employee, status: !employee.status }
            : employee,
        );
      });
    } catch (error) {
      handleAxiosError(error);
    } finally {
      removeId(`loading-switch-${employeeId}`);
    }
  }

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    setPaginate((prev) => ({ ...prev, index: value }));
  }

  function handleChangeRowPageSelector(event: ChangeEvent<HTMLInputElement>) {
    const newSize = event.target.value;
    setPaginate((prev) => ({ ...prev, size: Number(newSize) }));
  }

  useEffect(() => {
    if (dataEmployee) {
      setEmployees(dataEmployee.data);
      setEmployeeStatus(
        dataEmployee.data.map((data) => ({ id: data.id, status: data.status })),
      );

      setPaginate((prev) => ({ ...prev, ...dataEmployee.paginate }));
    }
  }, [dataEmployee]);

  return (
    <TableContainer>
      <Paper sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Box sx={{ width: 58 }}>
            <Select
              fullWidth
              disabled={isLoading}
              onChange={handleChangeRowPageSelector}
              value={paginate.size}
              menuItems={pageSizeOptions}
            />
          </Box>

          <Box>
            <Button
              disabled={isLoading}
              disableRipple
              variant="contained"
              startIcon={<Icon icon="ic:sharp-plus" />}
              onClick={() => addId("new-employee")}>
              Add New Employee
              <Modal
                scrollVertical
                open={activeIds.includes("new-employee")}
                onClose={() => removeId("new-employee")}>
                <AddEmployee closeMenu={() => removeId("new-employee")} />
              </Modal>
            </Button>
          </Box>
        </Stack>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone number</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell sx={{ width: "75px" }}>{null}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <RenderIf
            condition={
              !isLoading && employees !== null && employees.length > 0
            }>
            {employees?.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}>
                <TableCell component="th" scope="row">
                  <Stack direction="row" spacing={2} alignItems={"center"}>
                    <Avatar src={row.avatar} alt="Avatar user" />
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
                <TableCell>
                  <Tooltip
                    title={
                      <Typography>{formatAddress(row.address)}</Typography>
                    }>
                    <Typography>{formatAddress(row.address, 26)}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell>
                  <Switch
                    color="success"
                    onChange={() => {
                      handleChangeStatus(row.id);
                    }}
                    disabled={activeIds.includes(`loading-switch-${row.id}`)}
                    checked={
                      employeeStatus?.find((status) => status.id === row.id)
                        ?.status || false
                    }
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0}>
                    <IconButton onClick={() => addId(row.id)}>
                      <Icon icon="heroicons:pencil-solid" />
                      <Modal
                        open={activeIds.includes(row.id)}
                        onClose={() => removeId(row.id)}>
                        <UpdateEmployee
                          closeMenu={() => removeId(row.id)}
                          employeeData={row}
                        />
                      </Modal>
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </RenderIf>

          <RenderIf condition={isLoading}>
            <Repeat times={paginate.size}>
              <TableRow>
                <Repeat times={6}>
                  <TableCell sx={{ height: 68.5 }}>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </TableCell>
                </Repeat>
              </TableRow>
            </Repeat>
          </RenderIf>

          <RenderIf
            condition={
              !isLoading && employees !== null && employees.length === 0
            }>
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
              <Stack
                sx={{ padding: "0.78125rem 0.5625rem" }}
                direction="row"
                justifyContent={"space-between"}
                alignItems={"center"}>
                <Pagination
                  sx={{ marginLeft: "auto" }}
                  color="primary"
                  disabled={isLoading}
                  count={paginate.total}
                  page={paginate.index || 0}
                  onChange={handleChangePage}
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
export default EmployeeListPage;
