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
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import EmployeeUpdate from "./EmployeeUpdate";
import EmployeeAdd from "./EmployeeAdd";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import {
  formatAddress,
  getTruthyObject,
  handleToastMessages,
} from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Services
import {
  queryEmployees,
  toggleStatusEmployee,
} from "@/services/employeeService";

const EmployeePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState(true);
  const { activeIds, addId, removeId } = useSettings();
  const [employees, setEmployees] = useState<EmployeeDetail[]>();
  const [controller, setController] = useState<AbortController | null>(null);
  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: Filter<FilterEmployees> = {
    index: Number(searchParams.get("index")) || 1,
    size: Number(searchParams.get("size")) || Number(pageSizeOptions[0]),
    total: Number(searchParams.get("total")),
    groupId: searchParams.get("groupId"),
    status: searchParams.get("status"),
    gender: searchParams.get("gender") as Gender,
    fullName: searchParams.get("fullName") || "",
    sortBy: searchParams.get("sortBy") || "",
    sortOrder: (searchParams.get("sortOrder") as SortOrder) || "asc",
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
      filter.groupId,
      filter.status,
      filter.gender,
      filter.fullName,
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
      render: ({ avatar, fullName, email }) => (
        <Stack direction="row" spacing={1.25} alignItems={"center"}>
          <Avatar src={avatar} alt="Avatar user" />
          <Stack direction="column">
            <Typography fontWeight="500" color="text.primary">
              {fullName}
            </Typography>
            <Typography color="text.secondary">{email}</Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      render: ({ phone }) => phone,
    },
    {
      render: ({ address }) => (
        <Tooltip title={<Typography>{formatAddress(address)}</Typography>}>
          <Typography>{formatAddress(address, 26)}</Typography>
        </Tooltip>
      ),
    },
    {
      render: ({ group }) => group.name,
    },
    {
      render: ({ id, status }) => (
        <Switch
          color="success"
          onChange={() => handleChangeStatus(id)}
          disabled={activeIds.includes(ids.loadingSwitch(id))}
          checked={status || false}
        />
      ),
    },
    {
      render: ({ id }) => (
        <IconButton
          disableRipple
          onClick={() => addId(ids.modalUpdateEmployee(id))}>
          <Icon icon="heroicons:pencil-solid" />
          <Modal
            open={activeIds.includes(ids.modalUpdateEmployee(id))}
            onClose={() => removeId(ids.modalUpdateEmployee(id))}>
            <EmployeeUpdate
              employeeId={id}
              refetch={refetch}
              closeMenu={() => handleCancel(ids.modalUpdateEmployee(id))}
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
    refetch();
    if (searchInputRef.current) searchInputRef.current.value = "";
    setFilter({ ...defaultFilter, ...employeeData?.paginate });
  }

  function handleCancel(modalId: string) {
    controller?.abort();
    setController(null);
    removeId(modalId);
  }

  useEffect(() => {
    if (employeeData) {
      setEmployees(employeeData.data);
      setFilter((prev) => ({ ...prev, ...employeeData.paginate }));
    }

    setLoading(queryLoading);
  }, [employeeData]);

  useEffect(() => {
    const { total, ...truthyFilter } = getTruthyObject(filter);
    const params = new URLSearchParams(truthyFilter as Record<string, string>);
    setSearchParams(params);
  }, [filter]);

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
              onChange={(event) =>
                updateFilter({ index: 1, groupId: event.target.value })
              }
            />
            <Select
              value={filter.gender || ""}
              onChange={(event) =>
                updateFilter({ index: 1, gender: event.target.value as Gender })
              }
              menuItems={["Male", "Female", "Other"]}
              defaultOption={"Select Gender"}
              fullWidth
              isLoading={isLoading}
            />
            <Select
              value={filter.status || ""}
              onChange={(event) =>
                updateFilter({ index: 1, status: event.target.value })
              }
              menuItems={[
                { value: "true", label: "Active" },
                { value: "false", label: "Banned" },
              ]}
              defaultOption="Select Status"
              fullWidth
              isLoading={isLoading}
            />
          </Stack>
        </Stack>
        <Divider />
        <Stack
          sx={{
            gap: 2,
            p: 3,
            alignItems: { xs: "stretch", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}>
          <SearchInput
            fullWidth
            ref={searchInputRef}
            disabled={isLoading}
            placeholder="Search User"
            onChange={handleSearchEmployee}
            sx={{ height: 40, width: { xs: "100%", md: 170 } }}
          />

          <Stack
            sx={{
              gap: 2,
              alignItems: { xs: "stretch", md: "center" },
              flexDirection: { xs: "column", md: "row" },
            }}>
            <Stack
              sx={{
                gap: 1.5,
                alignItems: "center",
                flexDirection: "row",
              }}>
              <Typography>Show</Typography>
              <Select
                sx={{ height: 40, width: { xs: "100%", md: 65 } }}
                fullWidth
                disabled={isLoading}
                onChange={(event) =>
                  updateFilter({ index: 1, size: Number(event.target.value) })
                }
                value={filter.size}
                menuItems={pageSizeOptions}
              />
            </Stack>

            <Button
              sx={{
                height: 40,
                width: { xs: "100%", md: "max-content" },
                textWrap: "nowrap",
              }}
              disabled={isLoading}
              disableRipple
              color="error"
              variant="tonal"
              onClick={handleResetFilter}
              startIcon={<Icon icon="carbon:filter-reset" />}>
              Refresh
            </Button>
            <Button
              sx={{
                height: 40,
                textWrap: "nowrap",
                width: { xs: "100%", md: "max-content" },
              }}
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
