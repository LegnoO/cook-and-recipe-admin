// ** React Imports
import { ChangeEvent, useState, useEffect } from "react";

// ** Mui Imports
import {
  Box,
  IconButton,
  Stack,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Divider,
} from "@mui/material";

// ** Components
import {
  Table,
  TableContainer,
  Icon,
  Modal,
  Paper,
  Select,
  Switch,
} from "@/components/ui";
import { TableHead, TableBody, TableFooter } from "@/components";
import SearchInput from "@/components/fields/SearchInput";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

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
import GroupSelect from "@/components/fields/GroupSelect";

const EmployeeListPage = () => {
  const pageSizeOptions = ["2", "5", "10"];
  const { activeIds, addId, removeId } = useSettings();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);
  const [filter, setFilter] = useState<Filter>({
    total: 0,
    index: 1,
    size: Number(pageSizeOptions[0]),
    search: "",
    group: "",
    status: null,
    gender: "",
  });

  const {
    isLoading,
    data: dataEmployee,
    refetch,
  } = useQuery({
    queryKey: [
      "list-employee",
      filter.index,
      filter.size,
      filter.search,
      filter.group,
      filter.status,
      filter.gender,
    ],
    queryFn: () => getFilterEmployee(filter),
    ...queryOptions,
  });

  useEffect(() => {
    if (dataEmployee) {
      setEmployees(dataEmployee.data);
      setFilter((prev) => ({ ...prev, ...dataEmployee.paginate }));
    }
  }, [dataEmployee]);

  async function handleChangeStatus(employeeId: string) {
    try {
      addId(`loading-switch-${employeeId}`);
      await toggleStatusEmployee(employeeId);
      setEmployees(
        (prev) =>
          prev?.map((employee) =>
            employee.id === employeeId
              ? { ...employee, status: !employee.status }
              : employee,
          ) || prev,
      );
    } catch (error) {
      handleAxiosError(error);
    } finally {
      removeId(`loading-switch-${employeeId}`);
    }
  }

  function updateFilter(updates: Partial<Filter>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    updateFilter({ index: value });
  }

  function handleFilterGroup(event: ChangeEvent<HTMLInputElement>) {
    const newGroup = event.target.value;
    updateFilter({ group: newGroup });
  }

  function handleFilterGender(event: ChangeEvent<HTMLInputElement>) {
    const newGender = event.target.value as Gender;
    updateFilter({ gender: newGender });
  }

  function handleFilterStatus(event: ChangeEvent<HTMLInputElement>) {
    const newStatus = event.target.value;
    updateFilter({ status: newStatus });
  }

  function handleChangeRowPageSelector(event: ChangeEvent<HTMLInputElement>) {
    const newSize = event.target.value;
    updateFilter({ index: 1, size: Number(newSize) });
  }

  const handleSearchTest = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilter((prev) => ({ ...prev, search: event.target.value }));
    },
    300,
  );

  function handleCancel() {
    if (controller) {
      controller.abort();
      setController(null);
    }
    removeId("new-employee-modal");
  }

  const HEAD_COLUMNS = [
    { title: "Name" },
    { title: "Phone number" },
    { title: "Location" },
    { title: "Role" },
    { title: "Status" },
    { title: null, sx: { width: "75px" } },
  ];

  const BODY_CELLS = [
    {
      render: (row: Employee) => (
        <Stack direction="row" spacing={2} alignItems={"center"}>
          <Avatar src={row.avatar} alt="Avatar user" />
          <Stack direction="column">
            <Typography fontWeight="500" color="text.primary">
              {row.fullName}
            </Typography>
            <Typography color="text.secondary">{row.email}</Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      render: (row: Employee) => row.phone,
    },
    {
      render: (row: Employee) => (
        <Tooltip title={<Typography>{formatAddress(row.address)}</Typography>}>
          <Typography>{formatAddress(row.address, 26)}</Typography>
        </Tooltip>
      ),
    },
    {
      render: (row: Employee) => row.group,
    },
    {
      render: (row: Employee) => (
        <Switch
          color="success"
          onChange={() => handleChangeStatus(row.id)}
          disabled={activeIds.includes(`loading-switch-${row.id}`)}
          checked={
            employees?.find((employee) => employee.id === row.id)?.status ||
            false
          }
        />
      ),
    },
    {
      render: (row: Employee) => (
        <IconButton disableRipple onClick={() => addId(row.id)}>
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
      ),
    },
  ];

  return (
    <TableContainer>
      <Paper
        sx={{ p: 0, borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
        <Stack direction="column" spacing={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <GroupSelect
              name="groupId-filter"
              defaultOption={"Select Group"}
              fullWidth
              onChange={handleFilterGroup}
              SelectProps={{
                displayEmpty: true,
              }}
            />
            <Select
              onChange={handleFilterGender}
              menuItems={["Male", "Female", "Other"]}
              defaultOption={"Select Gender"}
              fullWidth
              SelectProps={{
                displayEmpty: true,
              }}
            />
            <Select
              onChange={handleFilterStatus}
              menuItems={[
                { value: "true", label: "Active" },
                { value: "false", label: "Banned" },
              ]}
              defaultOption={"Select Status"}
              fullWidth
              SelectProps={{
                displayEmpty: true,
              }}
            />
          </Stack>
        </Stack>
        <Divider />
        <Stack
          sx={{ p: 3 }}
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Box sx={{ minWidth: 68 }}>
            <Select
              sx={{ height: 42 }}
              fullWidth
              disabled={isLoading}
              onChange={handleChangeRowPageSelector}
              value={filter.size}
              menuItems={pageSizeOptions}
            />
          </Box>

          <Stack direction="row" alignItems="center" spacing={2}>
            <SearchInput
              disabled={isLoading}
              placeholder="Search User"
              onChange={handleSearchTest}
              fullWidth
              sx={{ height: 42 }}
            />
            <Button
              sx={{ minWidth: "max-content" }}
              disabled={isLoading}
              disableRipple
              variant="contained"
              startIcon={<Icon icon="ic:sharp-plus" />}
              onClick={() => addId("new-employee-modal")}>
              Add New Employee
              <Modal
                scrollVertical
                open={activeIds.includes("new-employee-modal")}
                onClose={() => removeId("new-employee-modal")}>
                <AddEmployee
                  refetch={refetch}
                  closeMenu={handleCancel}
                  setController={setController}
                />
              </Modal>
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Table>
        <TableHead headColumns={HEAD_COLUMNS} />
        <TableBody
          isLoading={isLoading}
          data={employees}
          filter={filter}
          bodyCells={BODY_CELLS}
        />
        <TableFooter
          dataLength={employees?.length}
          isLoading={isLoading}
          paginateCount={filter.total}
          paginatePage={filter.index || 0}
          handlePaginateChange={handleChangePage}
        />
      </Table>
    </TableContainer>
  );
};
export default EmployeeListPage;
