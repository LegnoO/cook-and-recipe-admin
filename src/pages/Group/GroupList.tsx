// ** React Imports
import { ChangeEvent, useState, useEffect, Fragment, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ** Mui Imports
import {
  Stack,
  Typography,
  Button,
  Divider,
  IconButton,
  Popover,
  Box,
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
  ChipStatus,
  Tooltip,
} from "@/components/ui";
import { TableHead, TableBody, Pagination } from "@/components";
import { SearchInput } from "@/components/fields";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import GroupUpdate from "./GroupUpdate";
import GroupAdd from "./GroupAdd";
import MoveMember from "./MoveMember";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import { formatDateTime, handleToastMessages } from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Services
import { queryGroups, toggleGroupStatus } from "@/services/groupServices";

const GroupList = () => {
  const navigate = useNavigate();
  const { activeIds, addId, removeId } = useSettings();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: FilterGroup = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    total: null,
    name: "",
    status: null,
    sortBy: "",
    sortOrder: "",
  };

  const ids = useMemo(
    () => ({
      loadingSwitch: (id: string) => `loading-switch-${id}`,
      modalUpdateGroup: (id: string) => `modal-update-employee-${id}`,
      modalAction: (id: string) => `modal-action-${id}`,
      modalMoveMember: (id: string) => `modal-move-member-${id}`,
      newGroupModal: "new-group-modal",
    }),
    [],
  );

  const [groups, setGroups] = useState<Group[] | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);
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
    queryFn: () => queryGroups(filter),

    ...queryOptions,
  });

  function handleToggleAction(id: string) {
    addId(ids.modalAction(id));
  }

  function handleCloseAction(id: string) {
    removeId(ids.modalAction(id));
  }

  async function handleChangeStatus(groupId: string) {
    try {
      addId(`loading-switch-${groupId}`);
      await toggleGroupStatus(groupId);
      setGroups(
        (prev) =>
          prev?.map((group) =>
            group.id === groupId ? { ...group, status: !group.status } : group,
          ) || prev,
      );
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
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

  const handleSearchGroup = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilter((prev) => ({ ...prev, name: event.target.value }));
    },
    300,
  );

  function handleResetFilter() {
    setFilter({ ...defaultFilter, ...groupData?.paginate });
  }

  function handleViewGroupId(groupId: string) {
    navigate("/employees", { state: { groupId } });
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
    }
  }, [groupData]);

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "name" },
    { title: "Permissions", sortName: "" },
    { title: "Members", sortName: "members" },
    { title: "Created Date", sortName: "createdDate" },
    { title: "Status", sortName: "status" },
    { title: "", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<Group>[] = [
    {
      render: (row: Group) => row.name,
    },
    {
      render: (row: Group) => (
        <Stack
          sx={{ flexWrap: "wrap", gap: 1 }}
          direction="row"
          alignItems={"center"}>
          {row.permissions.map((permission, index) => (
            <Tooltip
              placement="top-start"
              key={index}
              title={permission.actions.join(", ")}>
              <ChipStatus label={permission.page} sx={{ cursor: "pointer" }} />
            </Tooltip>
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
        <Fragment>
          <IconButton
            disableRipple
            aria-describedby={row.id}
            disableFocusRipple
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
              handleToggleAction(row.id);
            }}>
            <Icon icon="mingcute:more-2-fill" />
            <Popover
              id={row.id}
              anchorEl={anchorEl}
              open={activeIds.includes(ids.modalAction(row.id))}
              onClose={() => handleCloseAction(row.id)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              sx={{
                "& .MuiPaper-root": {
                  cursor: "pointer",
                  backgroundColor: (theme) => theme.palette.background.default,
                  boxShadow: (theme) => theme.shadows[3],
                  paddingInline: "0.5rem",
                  paddingBlock: "0.375rem",
                },
              }}>
              <Stack
                sx={{
                  "& > *": {
                    borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                    paddingInline: "0.5rem",
                    paddingBlock: "0.5rem",
                    minWidth: 120,
                  },

                  "& > *:not(:last-child)": { marginBottom: "0.25rem" },
                  "& > *:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                }}
                direction="column">
                <Stack
                  alignItems="center"
                  direction="row"
                  sx={{
                    gap: "0.5rem",
                    zIndex: 2101,
                  }}
                  onClick={() => {
                    handleViewGroupId(row.id);
                    handleCloseAction(row.id);
                  }}>
                  <IconButton sx={{ p: 0, m: 0 }} disableRipple>
                    <Icon icon="hugeicons:view" />
                  </IconButton>
                  <Typography color="text.secondary">
                    View all member
                  </Typography>
                </Stack>

                <Stack
                  alignItems="center"
                  direction="row"
                  sx={{
                    gap: "0.5rem",
                    zIndex: 2102,
                  }}
                  onClick={() => {
                    addId(ids.modalUpdateGroup(row.id));
                    handleCloseAction(row.id);
                  }}>
                  <IconButton sx={{ p: 0, m: 0 }} disableRipple>
                    <Icon icon="heroicons:pencil-solid" />
                    <Modal
                      open={activeIds.includes(ids.modalUpdateGroup(row.id))}
                      onClose={() => removeId(ids.modalUpdateGroup(row.id))}>
                      <GroupUpdate
                        groupId={row.id}
                        refetch={refetch}
                        closeMenu={() =>
                          handleCancel(ids.modalUpdateGroup(row.id))
                        }
                        setController={setController}
                      />
                    </Modal>
                  </IconButton>
                  <Typography color="text.secondary">Edit group</Typography>
                </Stack>

                <Stack
                  alignItems="center"
                  direction="row"
                  sx={{
                    gap: "0.5rem",
                    zIndex: 2103,
                  }}
                  onClick={() => {
                    addId(ids.modalMoveMember(row.id));
                    handleCloseAction(row.id);
                  }}>
                  <IconButton sx={{ p: 0, m: 0 }} disableRipple>
                    <Icon icon="mingcute:transfer-line" />
                    <Modal
                      open={activeIds.includes(ids.modalMoveMember(row.id))}
                      onClose={() => removeId(ids.modalMoveMember(row.id))}>
                      <MoveMember
                        group={row}
                        refetch={refetch}
                        closeMenu={() =>
                          handleCancel(ids.modalMoveMember(row.id))
                        }
                        setController={setController}
                      />
                    </Modal>
                  </IconButton>
                  <Typography color="text.secondary">
                    Move All Member
                  </Typography>
                </Stack>
              </Stack>
            </Popover>
          </IconButton>
        </Fragment>
      ),
    },
  ];

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
          sx={{ flexWrap: "wrap", gap: 2, p: 3 }}
          direction={{
            xs: "column",
            lg: "row",
          }}
          alignItems={"center"}
          justifyContent="space-between">
          <SearchInput
            disabled={isLoading}
            placeholder="Search Group"
            onChange={handleSearchGroup}
            fullWidth
            sx={{ height: 40, maxWidth: { xs: "100%", lg: 170 } }}
          />
          <Stack
            sx={{ width: { xs: "100%", lg: "fit-content" } }}
            spacing={2}
            direction={{
              xs: "column",
              lg: "row",
            }}
            alignItems={"center"}>
            <Stack
              sx={{ width: { xs: "100%", lg: "fit-content" }, gap: 1.5 }}
              direction="row"
              alignItems="center">
              <Typography>Show</Typography>
              <Select
                sx={{ height: 40, width: { xs: "100%", lg: 65 } }}
                fullWidth
                disabled={isLoading}
                onChange={handleChangeRowPageSelector}
                value={filter.size}
                menuItems={pageSizeOptions}
              />
            </Stack>
            <Select
              sx={{ height: 40, maxWidth: { xs: "100%", lg: 150 } }}
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
                height: 40,
                width: { xs: "100%", lg: 195 },
                textWrap: "nowrap",
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
              sx={{
                height: 40,
                textWrap: "nowrap",
                width: "100%",
                maxWidth: { xs: "100%", lg: 190 },
              }}
              disabled={isLoading}
              disableRipple
              variant="contained"
              startIcon={<Icon icon="ic:sharp-plus" />}
              onClick={() => addId(ids.newGroupModal)}>
              Add Permission
              <Modal
                open={activeIds.includes(ids.newGroupModal)}
                onClose={() => removeId(ids.newGroupModal)}>
                <GroupAdd
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
export default GroupList;
