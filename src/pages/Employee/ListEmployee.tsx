// ** React Imports
import { ChangeEvent, useState, useEffect, Fragment } from "react";

// ** Mui Imports
import {
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
import { TableHead, TableBody, Pagination } from "@/components";
import { SearchInput, GroupSelect } from "@/components/fields";

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

const ListEmployee = () => {
  const pageSizeOptions = ["10", "15", "20"];
  const { activeIds, addId, removeId } = useSettings();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);

  const defaultFilter: FilterEmployees = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    total: null,
    search: null,
    groupId: null,
    status: null,
    gender: null,
    sortBy: "",
    sortOrder: "",
  };

  const [filter, setFilter] = useState<FilterEmployees>(defaultFilter);

  const {
    isLoading,
    data: employeeData,
    refetch,
  } = useQuery({
    queryKey: [
      "list-employee",
      filter.index,
      filter.size,
      filter.search,
      filter.groupId,
      filter.status,
      filter.gender,
      filter.sortBy,
      filter.sortOrder,
    ],
    queryFn: () => getFilterEmployee(filter),

    ...queryOptions,
  });

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "fullName" },
    { title: "Phone number", sortName: "phone" },
    { title: "Location", sortName: "address.number" },
    { title: "Role", sortName: "group" },
    { title: "Status", sortName: "status" },
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
        <IconButton
          disableRipple
          onClick={() => addId(`modal-update-employee-${row.id}`)}>
          <Icon icon="heroicons:pencil-solid" />
          <Modal
            scrollVertical
            open={activeIds.includes(`modal-update-employee-${row.id}`)}
            onClose={() => removeId(`modal-update-employee-${row.id}`)}>
            <UpdateEmployee
              employeeId={row.id}
              refetch={refetch}
              closeMenu={() => handleCancel(`modal-update-employee-${row.id}`)}
              setController={setController}
            />
          </Modal>
        </IconButton>
      ),
    },
  ];
  useEffect(() => {
    if (employeeData) {
      setEmployees(employeeData.data);
      setFilter((prev) => ({ ...prev, ...employeeData.paginate }));
    }
  }, [employeeData]);

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

  function updateFilter(updates: Partial<FilterEmployees>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    updateFilter({ index: value });
  }

  function handleFilterChange(
    event: ChangeEvent<HTMLInputElement>,
    field: keyof FilterEmployees,
  ) {
    updateFilter({
      index: 1,
      [field]: event.target.value,
    });
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

  function handleResetFilter() {
    setFilter(defaultFilter);
  }

  function handleCancel(modalId: string) {
    if (controller) {
      controller.abort();
      setController(null);
    }
    removeId(modalId);
  }

  return (
    <Fragment>
      <Paper
        sx={{
          p: 0,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          boxShadow: "none",
        }}>
        <Stack direction="column" spacing={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Stack
            direction={{
              md: "row",
              xs: "column",
            }}
            spacing={3}
            alignItems="center">
            <GroupSelect
              value={filter.groupId || ""}
              name="groupId-filter"
              defaultOption={"Select Group"}
              fullWidth
              isLoading={isLoading}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(event, "groupId")
              }
            />
            <Select
              value={filter.gender || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(event, "gender")
              }
              menuItems={["Male", "Female", "Other"]}
              defaultOption={"Select Gender"}
              fullWidth
              isLoading={isLoading}
            />
            <Select
              value={filter.status || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(event, "status")
              }
              menuItems={[
                { value: "true", label: "Active" },
                { value: "false", label: "Banned" },
              ]}
              defaultOption={"Select Status"}
              fullWidth
              isLoading={isLoading}
            />
          </Stack>
        </Stack>
        <Divider />
        <Stack
          sx={{ p: 3, flexWrap: "wrap" }}
          direction={{
            md: "column",
            lg: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            md: "start",
            lg: "center",
          }}
          spacing={{
            xs: 2,
            md: 2,
          }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 1.5,
              md: 1.5,
            }}>
            <Typography>Show</Typography>
            <Select
              sx={{ height: 42, width: 70 }}
              fullWidth
              disabled={isLoading}
              onChange={handleChangeRowPageSelector}
              value={filter.size}
              menuItems={pageSizeOptions}
            />
          </Stack>

          <Stack
            direction={{
              sm: "column",
              md: "row",
            }}
            alignItems={{
              sm: "stretch",
              md: "center",
            }}
            spacing={{
              xs: 2,
              md: 2,
            }}>
            <SearchInput
              disabled={isLoading}
              placeholder="Search User"
              onChange={handleSearchTest}
              fullWidth
              sx={{
                height: 42,
                minWidth: 120,
              }}
            />
            <Button
              sx={{
                minWidth: "max-content",
              }}
              disabled={isLoading}
              disableRipple
              color="error"
              variant="tonal"
              onClick={handleResetFilter}
              startIcon={<Icon icon="carbon:filter-reset" />}>
              Reset Filter
            </Button>
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
                  closeMenu={() => handleCancel("new-employee-modal")}
                  setController={setController}
                />
              </Modal>
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead<FilterEmployees>
            isLoading={isLoading}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody<Employee, FilterEmployees>
            isLoading={isLoading}
            data={employees}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={employees?.length}
        isLoading={isLoading}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        handlePaginateChange={handleChangePage}
      />
    </Fragment>
  );
};
export default ListEmployee;
