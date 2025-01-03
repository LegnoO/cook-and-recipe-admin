// ** React Imports
import { useState, useEffect, ChangeEvent, Fragment, useRef } from "react";

// ** Mui Imports
import {
  Stack,
  Avatar,
  Typography,
  Button,
  Divider,
  IconButton,
} from "@mui/material";

// ** Components
import {
  Table,
  TableContainer,
  Icon,
  Modal,
  Paper,
  Select,
  ChipStatus,
  ConfirmBox,
  Tooltip,
} from "@/components/ui";
import { TableHead, TableBody, Pagination } from "@/components";
import { SearchInput } from "@/components/fields";

// ** Services
import { queryChef, disableChef, activeChef } from "@/services/chefService";

// ** Library ImportsImports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

// ** Context
import useSettings from "@/hooks/useSettings";

// ** Component's
import ChefDetail from "./ChefDetail";

// ** Utils
import { formatDateTime, handleToastMessages } from "@/utils/helpers";

// ** Config
import { queryOptions } from "@/config/query-options";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Types

const ListChefPending = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const pageSizeOptions = ["10", "15", "20"];

  const [isLoading, setLoading] = useState(false);
  const defaultFilter: Filter<FilterChef> = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    total: null,
    email: null,
    level: null,
    chefStatus: null,
    fullName: "",
    sortBy: "",
    sortOrder: "asc",
  };

  const [filter, setFilter] = useState<Filter<FilterChef>>(defaultFilter);
  const {
    isLoading: chefLoading,
    data: chefData,
    refetch,
  } = useQuery({
    queryKey: [
      "list-chef-pending",
      filter.index,
      filter.size,
      filter.email,
      filter.level,
      filter.fullName,
      filter.sortBy,
      filter.sortOrder,
      filter.chefStatus,
    ],
    queryFn: () => queryChef(filter),
    ...queryOptions,
  });
  const ids = {
    modalConfirm: (id: string) => `modal-confirm-${id}`,
    modalDetail: (id: string) => `modal-detail-${id}`,
  };

  const { activeIds, addId, removeId } = useSettings();
  const [chefs, setChefs] = useState<Chef[]>();
  const [controller, setController] = useState<AbortController | null>(null);

  const statusColorMap = {
    active: { variant: "active" },
    pending: { variant: "warning" },
    disabled: { variant: "disabled" },
    rejected: { variant: "error" },
    banned: { variant: "banned" },
  };

  function updateFilter(updates: Partial<Filter<FilterChef>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    updateFilter({ index: value });
  }

  function handleFilterChange(
    event: ChangeEvent<HTMLInputElement>,
    field: keyof Filter<FilterChef>,
  ) {
    updateFilter({ index: 1, [field]: event.target.value });
  }

  function handleChangeRowPageSelector(event: ChangeEvent<HTMLInputElement>) {
    const newSize = event.target.value;
    updateFilter({ index: 1, size: Number(newSize) });
  }

  function handleResetFilter() {
    refetch();
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setFilter({ ...defaultFilter, ...chefData?.paginate });
  }

  const searchDebounced = useDebouncedCallback(() => {
    if (searchInputRef.current) {
      setFilter((prev) => ({
        ...prev,
        fullName: searchInputRef.current!.value,
      }));
    }
  }, 300);

  const handleSearchChef = () => {
    searchDebounced();
  };

  function handleCancel(modalId: string) {
    if (controller) {
      controller.abort();
      setController(null);
    }
    removeId(modalId);
  }

  async function handleBanChef(row: Chef) {
    setLoading(true);
    const toastLoading = toast.loading("Loading...");
    try {
      const action = row.status === "banned" ? activeChef : disableChef;
      await action(`${row.id}`);
      toast.success("Banned successfully");
      refetch();
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
    } finally {
      handleCancel(ids.modalConfirm(row.id));
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }

  useEffect(() => {
    if (chefData) {
      setChefs(chefData.data);
      setFilter((prev) => ({ ...prev, ...chefData.paginate }));
    }
  }, [chefData]);

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "fullName" },
    { title: "Level", sortName: "level" },
    { title: "Description", sortName: "description" },
    { title: "Status", sortName: "status" },
    { title: "Started Date", sortName: "startedDate" },
    { title: "", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<Chef>[] = [
    {
      render: (row: Chef) => (
        <Stack direction="row" spacing={1.25} alignItems={"center"}>
          <Avatar src={row.userInfo.avatar} alt="Avatar user" />
          <Stack direction="column">
            <Typography fontWeight="500" color="text.primary">
              {row.userInfo.fullName}
            </Typography>
            <Typography color="text.secondary">{row.userInfo.email}</Typography>
          </Stack>
        </Stack>
      ),
    },
    { render: (row: Chef) => row.level },
    {
      render: (row: Chef) => row.description,
    },
    {
      render: (row: Chef) => formatDateTime(row.startedDate),
    },
    {
      render: (row: Chef) => (
        <ChipStatus
          label={row.status}
          variant={statusColorMap[row.status]?.variant as ColorVariant}
        />
      ),
    },

    {
      render: (row: Chef) => (
        <Fragment>
          <IconButton
            onClick={() => {
              addId(ids.modalDetail(row.id));
            }}
            disableRipple>
            <Icon icon="hugeicons:view" />
            <Modal
              open={activeIds.includes(ids.modalDetail(row.id))}
              onClose={() => removeId(ids.modalDetail(row.id))}>
              <ChefDetail
                closeMenu={() => handleCancel(ids.modalDetail(row.id))}
                chefId={row.id}
              />
            </Modal>
          </IconButton>
          <Tooltip
            arrow
            title={row.status === "banned" ? "Unban User" : "Ban User"}
            disableHoverListener={activeIds.includes(ids.modalConfirm(row.id))}>
            <IconButton
              sx={{
                "& svg": {
                  color: (theme) =>
                    row.status === "banned"
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                },
              }}
              onClick={() => {
                addId(ids.modalConfirm(row.id));
              }}
              disableRipple>
              <Icon
                icon={
                  row.status === "banned"
                    ? "mdi:user-unlocked"
                    : "basil:user-block-solid"
                }
              />
              <Modal
                open={activeIds.includes(ids.modalConfirm(row.id))}
                onClose={() => removeId(ids.modalConfirm(row.id))}>
                <ConfirmBox
                  isLoading={isLoading}
                  variant={row.status === "banned" ? "success" : "error"}
                  textSubmit={`Yes, ${row.status === "banned" ? "Unban" : "Ban"} !`}
                  textTitle={`Confirm ${row.status === "banned" ? "Unban" : "Ban"} ${row.userInfo.fullName}`}
                  textContent={`You're about to ${row.status === "banned" ? "Unban" : "Ban"} user '${row.userInfo.fullName}'. Are you sure?`}
                  onClick={async () => {
                    await handleBanChef(row);
                  }}
                  onClose={() => handleCancel(ids.modalConfirm(row.id))}
                />
              </Modal>
            </IconButton>
          </Tooltip>
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
            <Select
              value={filter.chefStatus || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(event, "chefStatus")
              }
              menuItems={[
                { label: "Active", value: "active" },
                { label: "Disabled", value: "disabled" },

                { label: "Rejected", value: "rejected" },
                { label: "Banned", value: "banned" },
              ]}
              defaultOption="Select Status"
              fullWidth
              isLoading={isLoading}
            />
            <Select
              value={filter.level || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(event, "level")
              }
              menuItems={[
                { value: "Beginner", label: "Beginner" },
                { value: "Home Cook", label: "Home cook" },
                { value: "Professional", label: "Professional" },
                { value: "Master chef", label: "Master chef" },
              ]}
              defaultOption={"Select Level"}
              fullWidth
              isLoading={chefLoading}
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
            ref={searchInputRef}
            fullWidth
            disabled={isLoading}
            placeholder="Search User"
            onChange={handleSearchChef}
            sx={{ height: 40, width: { xs: "100%", md: 180 } }}
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
                onChange={handleChangeRowPageSelector}
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
          </Stack>
        </Stack>
      </Paper>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead<FilterChef>
            isLoading={chefLoading}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody<Chef, FilterChef>
            isLoading={chefLoading}
            data={chefs}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={chefs?.length}
        isLoading={isLoading}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        handlePaginateChange={handleChangePage}
      />
    </Fragment>
  );
};
export default ListChefPending;
