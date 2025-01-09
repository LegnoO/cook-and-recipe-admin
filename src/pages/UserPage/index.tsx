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
import { SearchInput } from "@/components/fields";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import {
  formatAddress,
  getTruthyObject,
  handleToastMessages,
  shallowCompareObject,
  stringifyObjectValues,
} from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Services
import { queryUsers, toggleStatusUser } from "@/services/userService";
import UserDetail from "./UserDetail";

const UserPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: DefaultFilter & { groupId: string } = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    sortOrder: "asc",
    groupId: state ? state.groupId : undefined,
  };

  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams(stringifyObjectValues(getTruthyObject(defaultFilter))),
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState(true);
  const { activeIds, addId, removeId } = useSettings();
  const [users, setUsers] = useState<Client[]>();

  const [filter, setFilter] = useState<Filter<ClientFilter>>({
    index: Number(searchParams.get("index")) || defaultFilter.index,
    size: Number(searchParams.get("size")) || defaultFilter.size,
    groupId: searchParams.get("groupId") || undefined,
    status: searchParams.get("status") || undefined,
    gender: searchParams.get("gender") as Gender,
    fullName: searchParams.get("fullName") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder:
      (searchParams.get("sortOrder") as SortOrder) || defaultFilter.sortOrder,
    total: Number(searchParams.get("total")),
  });

  const ids = {
    loadingSwitch: (id: string) => `loading-switch-${id}`,
    modalDetail: (id: string) => `modal-update-user-${id}`,
    newEmployeeModal: "new-employee-modal",
  };

  const {
    isLoading: queryLoading,
    data: userData,
    refetch,
  } = useQuery({
    queryKey: ["list-user", searchParams.toString()],
    queryFn: () => queryUsers(searchParams.toString()),
    ...queryOptions,
  });

  const HEAD_COLUMNS = [
    { title: "Full name", sortName: "fullName" },
    { title: "Email", sortName: "email" },
    { title: "Phone number", sortName: "phone" },
    { title: "Location", sortName: "address.number" },
    { title: "Status", sortName: "status" },
    { title: "", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<Client>[] = [
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
      render: ({ email }) => email,
    },
    {
      render: ({ phone }) => phone,
    },

    {
      render: ({ address }) => (
        <Fragment>
          {address ? (
            <Tooltip title={<Typography>{formatAddress(address)}</Typography>}>
              <Typography>{formatAddress(address, 26)}</Typography>
            </Tooltip>
          ) : (
            <Fragment />
          )}
        </Fragment>
      ),
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
        <Stack sx={{ flexDirection: "row" }}>
          <Tooltip title="View details">
            <IconButton
              disableRipple
              onClick={() => addId(ids.modalDetail(id))}>
              <Icon icon="hugeicons:view" />
              <Modal
                open={activeIds.includes(ids.modalDetail(id))}
                onClose={() => removeId(ids.modalDetail(id))}>
                <UserDetail
                  userId={id}
                  closeMenu={() => handleCancel(ids.modalDetail(id))}
                />
              </Modal>
            </IconButton>
          </Tooltip>
          <Tooltip title="View notifications">
            <IconButton
              disableRipple
              onClick={() => handleViewNotification(id)}>
              <Icon icon="mdi:bell-outline" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  function handleViewNotification(userId: string) {
    navigate("/notification", { state: { receiverId: userId } });
  }

  function handleCancel(modalId: string) {
    removeId(modalId);
  }

  async function handleChangeStatus(userId: string) {
    try {
      addId(`loading-switch-${userId}`);
      await toggleStatusUser(userId);
      setUsers(
        (prev) =>
          prev?.map((user) =>
            user.id === userId ? { ...user, status: !user.status } : user,
          ) || prev,
      );
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
    } finally {
      removeId(`loading-switch-${userId}`);
    }
  }

  function updateFilter(updates: Partial<Filter<ClientFilter>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  const handleSearchUser = useDebouncedCallback(() => {
    const fullName = searchInputRef.current?.value.trim() || "";

    setFilter((prev) => ({
      ...prev,
      fullName,
    }));
  }, 300);

  function handleResetFilter() {
    if (searchInputRef.current) searchInputRef.current.value = "";

    setFilter((prev) => {
      delete prev.total;
      if (
        shallowCompareObject(
          getTruthyObject(prev),
          getTruthyObject(defaultFilter),
        )
      ) {
        refetch();
      }
      return defaultFilter;
    });
  }

  useEffect(() => {
    if (userData) {
      setUsers(userData.data);
      setFilter((prev) => ({ ...prev, ...userData.paginate }));
    }

    setLoading(queryLoading);
  }, [userData]);

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams((params) => params);
    }
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
            defaultValue={filter.fullName}
            ref={searchInputRef}
            disabled={queryLoading && !users}
            placeholder="Search User"
            onChange={handleSearchUser}
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
                disabled={queryLoading && !users}
                onChange={(event) =>
                  updateFilter({ index: 1, size: Number(event.target.value) })
                }
                value={filter.size}
                menuItems={pageSizeOptions}
              />
            </Stack>

            <Select
              sx={{
                "&": { height: 40, width: { xs: "100%", md: "fit-content" } },
                "& .MuiSelect-select": {
                  width: { xs: "100%", md: 115 },
                },
              }}
              value={filter.gender || ""}
              onChange={(event) =>
                updateFilter({ index: 1, gender: event.target.value as Gender })
              }
              menuItems={["Male", "Female", "Other"]}
              defaultOption={"Select Gender"}
              fullWidth
              isLoading={queryLoading && !users}
            />

            <Select
              sx={{
                "&": { height: 40, width: { xs: "100%", md: "fit-content" } },
                "& .MuiSelect-select": {
                  width: { xs: "100%", md: 110 },
                },
              }}
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
              isLoading={queryLoading && !users}
            />

            <Button
              sx={{
                height: 40,
                width: { xs: "100%", md: "max-content" },
                textWrap: "nowrap",
              }}
              disabled={queryLoading && !users}
              disableRipple
              color="error"
              variant="tonal"
              onClick={handleResetFilter}
              startIcon={<Icon icon="carbon:filter-reset" />}>
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead
            isLoading={queryLoading && !users}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody
            isLoading={queryLoading && !users}
            data={users}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={users?.length}
        isLoading={isLoading}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        onChange={(_event: ChangeEvent<unknown>, value: number) => {
          updateFilter({ index: value });
        }}
      />
    </Fragment>
  );
};
export default UserPage;
