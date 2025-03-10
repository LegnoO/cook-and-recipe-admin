// ** React Imports
import {
  ChangeEvent,
  useState,
  useEffect,
  Fragment,
  useMemo,
  useRef,
} from "react";

// ** Mui Imports
import {
  Stack,
  Typography,
  Button,
  Divider,
  IconButton,
  Popover,
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
  ConfirmBox,
} from "@/components/ui";
import { TableHead, TableBody, Pagination } from "@/components";
import { SearchInput } from "@/components/fields";
import ProgressBarLoading from "@/components/ui/ProgressBarLoading";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import GroupUpdate from "./GroupUpdate";
import GroupAdd from "./GroupAdd";
import MoveMember from "./MoveMember";

// ** Hooks
import useSettings from "@/hooks/useSettings";
import useAuth from "@/hooks/useAuth";

// ** Utils
import {
  formatDateTime,
  getTruthyObject,
  handleToastMessages,
  shallowCompareObject,
  stringifyObjectValues,
} from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Services
import {
  queryGroups,
  toggleGroupStatus,
  deleteGroup,
} from "@/services/groupServices";

const GroupList = () => {
  const navigate = useNavigate();
  const { can } = useAuth();

  if (!can("group", "read")) {
    navigate("/dashboard");
  }

  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: DefaultFilter = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    sortOrder: "asc",
  };
  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams(stringifyObjectValues(defaultFilter)),
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { activeIds, addId, removeId } = useSettings();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const ids = useMemo(
    () => ({
      loadingSwitch: (id: string) => `loading-switch-${id}`,
      modalUpdateGroup: (id: string) => `modal-update-employee-${id}`,
      modalAction: (id: string) => `modal-action-${id}`,
      modalMoveMember: (id: string) => `modal-move-member-${id}`,
      modalDeleteGroup: (id: string) => `modal-delete-group-${id}`,
      newGroupModal: "new-group-modal",
    }),
    [],
  );

  const [groups, setGroups] = useState<Group[]>();
  const [controller, setController] = useState<AbortController | null>(null);
  const [filter, setFilter] = useState<FilterGroup>({
    index: Number(searchParams.get("index")) || defaultFilter.index,
    size: Number(searchParams.get("size")) || defaultFilter.size,
    name: searchParams.get("name") || undefined,
    status: searchParams.get("status") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder:
      (searchParams.get("sortOrder") as SortOrder) || defaultFilter.sortOrder,
    total: Number(searchParams.get("total")),
  });

  const {
    isLoading,
    data: groupData,
    refetch,
  } = useQuery({
    queryKey: ["list-group", searchParams.toString()],
    queryFn: () => queryGroups(searchParams.toString()),

    ...queryOptions,
  });

  function handleToggleAction(id: string) {
    addId(ids.modalAction(id));
  }

  function handleCloseAction(id: string) {
    removeId(ids.modalAction(id));
  }

  async function handleDeleteGroup(id: string) {
    const toastLoading = toast.loading("Loading...");

    try {
      await deleteGroup(id);
      toast.success("Delete group successfully");
      refetch();
    } catch (error) {
      toast.error(handleAxiosError(error));
    } finally {
      toast.dismiss(toastLoading);
    }
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

  const handleSearchGroup = useDebouncedCallback(() => {
    const name = searchInputRef.current?.value.trim() || "";

    setFilter((prev) => ({
      ...prev,
      name,
    }));
  }, 300);

  function handleResetFilter() {
    refetch();
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

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

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams((params) => params);
    }
    const { total, ...truthyFilter } = getTruthyObject(filter);
    const params = new URLSearchParams(truthyFilter as Record<string, string>);
    setSearchParams(params);
  }, [filter]);

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "name" },
    { title: "Permissions", sortName: "" },
    { title: "Members", sortName: "members" },
    { title: "Created Date", sortName: "createdDate" },
    can("group", "update") ? { title: "Status", sortName: "status" } : null,
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
      permission: can("group", "update"),
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

                {can("group", "update") && (
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
                    <IconButton
                      sx={{
                        p: 0,
                        m: 0,
                      }}
                      disableRipple>
                      <Icon
                        className="update-icon"
                        icon="heroicons:pencil-solid"
                      />
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
                )}

                {can("group", "update") && (
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
                    <IconButton
                      sx={{
                        p: 0,
                        m: 0,
                      }}
                      disableRipple>
                      <Icon
                        className="move-member-icon"
                        icon="mingcute:transfer-line"
                      />
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
                )}

                {can("group", "delete") && (
                  <Stack
                    alignItems="center"
                    direction="row"
                    sx={{
                      gap: "0.5rem",
                      zIndex: 2103,
                    }}
                    onClick={() => {
                      addId(ids.modalDeleteGroup(row.id));
                      handleCloseAction(row.id);
                    }}>
                    <IconButton
                      sx={{
                        p: 0,
                        m: 0,
                      }}
                      color="error"
                      disableRipple>
                      <Icon className="delete-icon" icon="ion:trash-outline" />
                      <Modal
                        open={activeIds.includes(ids.modalDeleteGroup(row.id))}
                        onClose={() => removeId(ids.modalDeleteGroup(row.id))}>
                        <ConfirmBox
                          hideReason
                          isLoading={isLoading}
                          variant="error"
                          boxContent={{
                            textSubmit: "Delete",
                            textTitle: `Confirm delete group ${row.name}`,
                            textContent: `You're about to delete group '${row.name}'. Are you sure?`,
                          }}
                          onClick={() => handleDeleteGroup(row.id)}
                          onClose={() =>
                            handleCancel(ids.modalDeleteGroup(row.id))
                          }
                        />
                      </Modal>
                    </IconButton>
                    <Typography color="error">Delete Group</Typography>
                  </Stack>
                )}
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
          sx={{
            gap: 2,
            p: 3,
            alignItems: { xs: "stretch", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}>
          <SearchInput
            ref={searchInputRef}
            disabled={isLoading && !groups}
            placeholder="Search Group"
            onChange={handleSearchGroup}
            fullWidth
            sx={{ height: 40, width: { xs: "100%", md: 170 } }}
          />
          <Stack
            sx={{
              gap: 2,
              alignItems: { xs: "stretch", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              flexWrap: "wrap",
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
            <Select
              sx={{
                "&": {
                  width: { height: 40, xs: "100%", md: "fit-content" },
                },
                "& .MuiSelect-select": {
                  width: { xs: "100%", md: 110 },
                },
              }}
              value={filter.status?.toString() || ""}
              onChange={(event) =>
                updateFilter({
                  index: 1,
                  status: event.target.value,
                })
              }
              menuItems={[
                { value: "true", label: "Active" },
                { value: "false", label: "Disable" },
              ]}
              defaultOption="Select Status"
              fullWidth
              isLoading={isLoading && !groups}
            />
            <Button
              sx={{
                height: 40,
                width: { xs: "100%", md: "max-content" },
                textWrap: "nowrap",
              }}
              disabled={isLoading && !groups}
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
              disabled={isLoading && !groups}
              disableRipple
              variant="contained"
              startIcon={<Icon icon="ic:sharp-plus" />}
              onClick={() => addId(ids.newGroupModal)}>
              Add Group Permission
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
        <ProgressBarLoading isLoading={isLoading} />
        <Table>
          <TableHead
            isLoading={isLoading && !groups}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody
            isLoading={isLoading && !groups}
            data={groups}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={groups?.length}
        isLoading={isLoading && !groups}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        onChange={(_event: ChangeEvent<unknown>, value: number) => {
          updateFilter({ index: value });
        }}
      />
    </Fragment>
  );
};
export default GroupList;
