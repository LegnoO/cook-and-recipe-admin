// ** React Imports
import { ChangeEvent, useState, useEffect, Fragment, useRef } from "react";

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
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import EmployeeUpdate from "./EmployeeUpdate";
import EmployeeAdd from "./EmployeeAdd";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import { formatAddress, handleToastMessages } from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Services
import {
  queryEmployees,
  toggleStatusEmployee,
} from "@/services/employeeService";

const EmployeePage = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  const { activeIds, addId, removeId } = useSettings();
  const [employees, setEmployees] = useState<EmployeeDetail[]>();
  const [controller, setController] = useState<AbortController | null>(null);
  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: Filter<FilterEmployees> = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    total: null,
    groupId: location.state?.groupId || null,
    status: null,
    gender: null,
    fullName: "",
    sortBy: "",
    sortOrder: "",
  };
  const [filter, setFilter] = useState<Filter<FilterEmployees>>(defaultFilter);

  const ids = {
    loadingSwitch: (id: string) => `loading-switch-${id}`,
    modalUpdateEmployee: (id: string) => `modal-update-employee-${id}`,
    newEmployeeModal: "new-employee-modal",
  };

  const {
    isLoading: queryLoading,
    data: employeeData,
    refetch,
  } = useQuery({
    queryKey: [
      "list-employee",
      filter.index,
      filter.size,
      filter.fullName,
      filter.groupId,
      filter.status,
      filter.gender,
      filter.sortBy,
      filter.sortOrder,
    ],
    queryFn: () => queryEmployees(filter),

    ...queryOptions,
  });

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "fullName" },
    { title: "Phone number", sortName: "phone" },
    { title: "Location", sortName: "address.number" },
    { title: "Group", sortName: "group" },
    { title: "Status", sortName: "status" },
    { title: "", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<EmployeeDetail>[] = [
    {
      render: (row: EmployeeDetail) => (
        <Stack direction="row" spacing={1.25} alignItems={"center"}>
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
      render: (row: EmployeeDetail) => row.phone,
    },
    {
      render: (row: EmployeeDetail) => (
        <Tooltip title={<Typography>{formatAddress(row.address)}</Typography>}>
          <Typography>{formatAddress(row.address, 26)}</Typography>
        </Tooltip>
      ),
    },
    {
      render: (row: EmployeeDetail) => row.group.name,
    },
    {
      render: (row: EmployeeDetail) => (
        <Switch
          color="success"
          onChange={() => handleChangeStatus(row.id)}
          disabled={activeIds.includes(ids.loadingSwitch(row.id))}
          checked={row.status || false}
        />
      ),
    },
    {
      render: (row: EmployeeDetail) => (
        <IconButton
          disableRipple
          onClick={() => addId(ids.modalUpdateEmployee(row.id))}>
          <Icon icon="heroicons:pencil-solid" />
          <Modal
            open={activeIds.includes(ids.modalUpdateEmployee(row.id))}
            onClose={() => removeId(ids.modalUpdateEmployee(row.id))}>
            <EmployeeUpdate
              employeeId={row.id}
              refetch={refetch}
              closeMenu={() => handleCancel(ids.modalUpdateEmployee(row.id))}
              setController={setController}
            />
          </Modal>
        </IconButton>
      ),
    },
  ];

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
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
    } finally {
      removeId(`loading-switch-${employeeId}`);
    }
  }

  function updateFilter(updates: Partial<Filter<FilterEmployees>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    updateFilter({ index: value });
  }

  function handleFilterChange(
    event: ChangeEvent<HTMLInputElement>,
    field: keyof Filter<FilterEmployees>,
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

  const searchDebounced = useDebouncedCallback(() => {
    if (searchInputRef.current) {
      setFilter((prev) => ({
        ...prev,
        fullName: searchInputRef.current!.value,
      }));
    }
  }, 300);

  const handleSearchEmployee = () => {
    searchDebounced();
  };

  function handleResetFilter() {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    setFilter({ ...defaultFilter, ...employeeData?.paginate });
  }

  function handleCancel(modalId: string) {
    if (controller) {
      controller.abort();
      setController(null);
    }
    removeId(modalId);
  }

  useEffect(() => {
    if (employeeData) {
      setEmployees(employeeData.data);
      setFilter((prev) => ({ ...prev, ...employeeData.paginate }));
    }

    setLoading(queryLoading);
  }, [employeeData]);

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
              xs: "column",
              sm: "row",
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
          sx={{ flexWrap: "wrap", gap: 2, p: 3 }}
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems="center"
          justifyContent="space-between">
          <SearchInput
            fullWidth
            ref={searchInputRef}
            disabled={isLoading}
            placeholder="Search User"
            onChange={handleSearchEmployee}
            sx={{
              height: 40,
              width: { xs: "100%", sm: 170 },
            }}
          />

          <Stack
            sx={{ width: { xs: "100%", sm: "fit-content" } }}
            spacing={2}
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={"center"}>
            <Stack
              sx={{ width: { xs: "100%", sm: "fit-content" }, gap: 1.5 }}
              direction="row"
              alignItems="center">
              <Typography>Show</Typography>
              <Select
                sx={{ height: 40, width: { xs: "100%", sm: 65 } }}
                fullWidth
                disabled={isLoading}
                onChange={handleChangeRowPageSelector}
                value={filter.size}
                menuItems={pageSizeOptions}
              />
            </Stack>

            <Button
              sx={{
                height: 40,
                width: { xs: "100%", sm: 150 },
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
              sx={{ height: 40, width: { xs: "100%", sm: 205 } }}
              disabled={isLoading}
              disableRipple
              variant="contained"
              startIcon={<Icon icon="ic:sharp-plus" />}
              onClick={() => addId(ids.newEmployeeModal)}>
              Add New Employee
              <Modal
                open={activeIds.includes(ids.newEmployeeModal)}
                onClose={() => removeId(ids.newEmployeeModal)}>
                <EmployeeAdd
                  refetch={refetch}
                  closeMenu={() => handleCancel(ids.newEmployeeModal)}
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
          <TableBody<EmployeeDetail, FilterEmployees>
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
export default EmployeePage;
