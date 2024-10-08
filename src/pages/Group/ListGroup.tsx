// ** React Imports
import { ChangeEvent, useState, useEffect, Fragment } from "react";

// ** Mui Imports
import { Stack, Typography, Button, Divider, IconButton } from "@mui/material";

// ** Components
import {
  Table,
  TableContainer,
  Icon,
  Modal,
  Paper,
  Select,
  Switch,
  ChipStatus,
} from "@/components/ui";
import { TableHead, TableBody, Pagination } from "@/components";
import { SearchInput } from "@/components/fields";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import UpdateGroup from "./UpdateGroup";
import AddGroup from "./AddGroup";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import { formatDateTime } from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Services
import { getAllGroups, toggleStatusGroup } from "@/services/groupServices";


const ListGroup = () => {
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  const ids = {
    loadingSwitch: (id: string) => `loading-switch-${id}`,
    modalUpdateGroup: (id: string) => `modal-update-employee-${id}`,
    newGroupModal: "new-group-modal",
  };
  const pageSizeOptions = ["10", "15", "20"];
  const { activeIds, addId, removeId } = useSettings();
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);
  const defaultFilter: FilterGroup = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    total: null,
    name: "",
    status: null,
    sortBy: "",
    sortOrder: "",
  };

  const [filter, setFilter] = useState<FilterGroup>(defaultFilter);

  const {
    isLoading,
    data: groupData,
    refetch,
  } = useQuery({
    queryKey: [
      "list-group",
      filter.index,
      filter.size,
      filter.name,
      filter.status,
      filter.sortBy,
      filter.sortOrder,
    ],
    queryFn: () => getAllGroups(filter),

    ...queryOptions,
  });

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "name" },
    { title: "Permissions", sortName: "" },
    { title: "Members", sortName: "members" },
    { title: "Created Date", sortName: "createdDate" },
    { title: "Status", sortName: "status" },
    { title: null, sx: { width: "75px" } },
  ];

  const BODY_CELLS = [
    {
      render: (row: Group) => row.name,
    },
    {
      width: 300,
      render: (row: Group) => (
        <Stack
          sx={{ flexWrap: "wrap", gap: 1 }}
          direction="row"
          alignItems={"center"}>
          {row.permissions.map((permission, index) => (
            <ChipStatus key={index} label={permission.page} />
          ))}
        </Stack>
      ),
    },
    {
      render: (row: Group) => row.members,
    },
    {
      render: (row: Group) => formatDateTime(row.createdDate),
    },
    {
      render: (row: Group) => (
        <Switch
          color="success"
          onChange={() => handleChangeStatus(row.id)}
          disabled={activeIds.includes(`loading-switch-${row.id}`)}
          checked={groups?.find((group) => group.id === row.id)?.status}
        />
      ),
    },
    {
      render: (row: Group) => (
        <IconButton
          disableRipple
          onClick={() => addId(ids.modalUpdateGroup(row.id))}>
          <Icon icon="heroicons:pencil-solid" />
          <Modal
            open={activeIds.includes(ids.modalUpdateGroup(row.id))}
            onClose={() => removeId(ids.modalUpdateGroup(row.id))}>
            <UpdateGroup
            
              groupId={row.id}
              refetch={refetch}
              closeMenu={() => handleCancel(ids.modalUpdateGroup(row.id))}
              setController={setController}
            />
          </Modal>
        </IconButton>
      ),
    },
  ];

  async function handleChangeStatus(groupId: string) {
    try {
      addId(`loading-switch-${groupId}`);
      await toggleStatusGroup(groupId);
      setGroups(
        (prev) =>
          prev?.map((group) =>
            group.id === groupId ? { ...group, status: !group.status } : group,
          ) || prev,
      );
    } catch (error) {
      handleAxiosError(error);
    } finally {
      removeId(`loading-switch-${groupId}`);
    }
  }

  function updateFilter(updates: Partial<Filter<FilterGroup>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    updateFilter({ index: value });
  }

  function handleFilterChange(
    event: ChangeEvent<HTMLInputElement>,
    field: keyof Filter<FilterGroup>,
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

  const handleSearch = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilter((prev) => ({ ...prev, name: event.target.value }));
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

  useEffect(() => {
    if (groupData) {
      setGroups(groupData.data);
      setFilter((prev) => ({ ...prev, ...groupData.paginate }));
      // navigate("/employees", { state: { groupId: "66fa5d3a13620c9a19078b05" } });
    }
  }, [groupData]);

  return (
    <Fragment>
      <Paper
        sx={{
          p: 0,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          boxShadow: "none",
        }}>
        {/* <Stack direction="column" spacing={2} sx={{ p: 3 }}>
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
        <Divider /> */}
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
              placeholder="Search Permission"
              onChange={handleSearch}
              fullWidth
              sx={{ minWidth: 220 }}
            />
            <Select
              value={filter.status || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(event, "status")
              }
              menuItems={[
                { value: "true", label: "Active" },
                { value: "false", label: "Disable" },
              ]}
              defaultOption={"Select Status"}
              fullWidth
              isLoading={isLoading}
            />
            <Button
              sx={{
                minWidth: "max-content",
              }}
              disabled={isLoading}
              disableRipple
              color="error"
              variant="outlined"
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
              onClick={() => addId(ids.newGroupModal)}>
              Add Permission
              <Modal
                open={activeIds.includes(ids.newGroupModal)}
                onClose={() => removeId(ids.newGroupModal)}>
                <AddGroup
                  permissions={permissions}
                  setPermissions={setPermissions}
                  refetch={refetch}
                  closeMenu={() => handleCancel(ids.newGroupModal)}
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
          <TableHead
            isLoading={isLoading}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody
            isLoading={isLoading}
            data={groups}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={groups?.length}
        isLoading={isLoading}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        handlePaginateChange={handleChangePage}
      />
    </Fragment>
  );
};
export default ListGroup;
