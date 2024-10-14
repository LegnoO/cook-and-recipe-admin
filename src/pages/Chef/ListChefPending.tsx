// ** React Imports
import { useState, useEffect, ChangeEvent, Fragment } from "react";

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
import {
  getFilterChefPending,
  toggleChefRequest,
} from "@/services/chefService";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

// ** Context
import useSettings from "@/hooks/useSettings";

// ** Utils
import { formatDateTime } from "@/utils/helpers";

// ** Component's
import ChefDetail from "./ChefDetail";

// ** Config
import { queryOptions } from "@/config/query-options";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Types

const ListChefPending = () => {
  const pageSizeOptions = ["10", "15", "20"];

  const [isLoading, setLoading] = useState(false);
  const defaultFilter: Filter<FilterChefPending> = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    total: null,
    email: null,
    level: null,
    fullName: "",
    sortBy: "",
    sortOrder: "",
  };

  const [filter, setFilter] =
    useState<Filter<FilterChefPending>>(defaultFilter);
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
    ],
    queryFn: () => getFilterChefPending(filter),
    ...queryOptions,
  });
  const ids = {
    modalConfirmApprove: (id: string) => `modal-confirm-approve-${id}`,
    modalConfirmReject: (id: string) => `modal-confirm-reject-${id}`,
    modalDetail: (id: string) => `modal-detail-${id}`,
  };

  const { activeIds, addId, removeId } = useSettings();
  const [chefs, setChefs] = useState<Chef[] | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);

  const statusColorMap = {
    active: { variant: "active" },
    pending: { variant: "warning" },
    disabled: { variant: "disabled" },
    rejected: { variant: "error" },
    banned: { variant: "banned" },
  };

  function updateFilter(updates: Partial<Filter<FilterChefPending>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    updateFilter({ index: value });
  }

  function handleFilterChange(
    event: ChangeEvent<HTMLInputElement>,
    field: keyof Filter<FilterChefPending>,
  ) {
    updateFilter({ index: 1, [field]: event.target.value });
  }

  function handleChangeRowPageSelector(event: ChangeEvent<HTMLInputElement>) {
    const newSize = event.target.value;
    updateFilter({ index: 1, size: Number(newSize) });
  }

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

  async function handleApproveOrRejectChef(chefId: string, status: boolean) {
    setLoading(true);
    const toastLoading = toast.loading("Loading...");

    const toastMessage = status
      ? "Approve successfully"
      : "Reject successfully";

    try {
      await toggleChefRequest(chefId, status);
      toast.success(toastMessage);
      refetch();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      if (status) {
        handleCancel(ids.modalConfirmApprove(chefId));
      } else {
        handleCancel(ids.modalConfirmReject(chefId));
      }
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }

  const handleSearchChef = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilter((prev) => ({ ...prev, fullName: event.target.value }));
    },
    300,
  );

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

  const BODY_CELLS = [
    {
      render: (row: Chef) => (
        <Stack direction="row" spacing={2} alignItems={"center"}>
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
          label={row.status || "description"}
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
            disableHoverListener={activeIds.includes(
              ids.modalConfirmReject(row.id),
            )}
            arrow
            title="Reject Promotion">
            <IconButton
              sx={{
                "& svg": { color: (theme) => theme.palette.error.main },
              }}
              onClick={() => {
                addId(ids.modalConfirmReject(row.id));
              }}
              disableRipple>
              <Icon icon={"mdi:close"} />
              <Modal
                open={activeIds.includes(ids.modalConfirmReject(row.id))}
                onClose={() => removeId(ids.modalConfirmReject(row.id))}>
                <ConfirmBox
                  isLoading={isLoading}
                  variant={"warning"}
                  textSubmit={"Yes, reject !"}
                  textTitle={`Confirm reject ${row.userInfo.fullName}`}
                  textContent={`You're about to reject user '${row.userInfo.fullName}' as a chef. Are you sure?`}
                  onClick={async () => {
                    await handleApproveOrRejectChef(row.id, false);
                  }}
                  onClose={() => handleCancel(ids.modalConfirmReject(row.id))}
                />
              </Modal>
            </IconButton>
          </Tooltip>
          <Tooltip
            disableHoverListener={activeIds.includes(
              ids.modalConfirmApprove(row.id),
            )}
            arrow
            title="Approve Promotion">
            <IconButton
              sx={{
                "& svg": { color: (theme) => theme.palette.success.main },
              }}
              onClick={() => {
                addId(ids.modalConfirmApprove(row.id));
              }}
              disableRipple>
              <Icon icon={"mdi:tick"} />
              <Modal
                open={activeIds.includes(ids.modalConfirmApprove(row.id))}
                onClose={() => removeId(ids.modalConfirmApprove(row.id))}>
                <ConfirmBox
                  isLoading={isLoading}
                  variant={"info"}
                  textSubmit={"Yes, approve !"}
                  textTitle={`Confirm approve ${row.userInfo.fullName}`}
                  textContent={`You're about to approve user '${row.userInfo.fullName}' as a chef. Are you sure?`}
                  onClick={async () => {
                    await handleApproveOrRejectChef(row.id, true);
                  }}
                  onClose={() => handleCancel(ids.modalConfirmApprove(row.id))}
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
              disabled={chefLoading}
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
              disabled={chefLoading}
              placeholder="Search Chef"
              onChange={handleSearchChef}
              fullWidth
              sx={{ height: 40, minWidth: 220 }}
            />

            <Select
              sx={{ height: 40, minWidth: 140 }}
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
            <Button
              sx={{
                minWidth: "max-content",
              }}
              disabled={isLoading || chefLoading}
              disableRipple
              color="error"
              variant="outlined"
              onClick={handleResetFilter}
              startIcon={<Icon icon="carbon:filter-reset" />}>
              Reset Filter
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead<FilterChefPending>
            isLoading={chefLoading}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody<Chef, FilterChefPending>
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
