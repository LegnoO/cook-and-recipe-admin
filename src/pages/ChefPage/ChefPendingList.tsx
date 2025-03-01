// ** React Imports
import { useState, useEffect, useRef, Fragment } from "react";

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
import ProgressBarLoading from "@/components/ui/ProgressBarLoading";

// ** Services
import { queryChefPending, toggleChefRequest } from "@/services/chefService";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

// ** Context
import useSettings from "@/hooks/useSettings";

// ** Utils
import {
  formatDateTime,
  getTruthyObject,
  handleToastMessages,
  shallowCompareObject,
  stringifyObjectValues,
} from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Component's
import ChefDetail from "./ChefDetail";

// ** Config
import { queryOptions } from "@/config/query-options";
import { useSearchParams } from "react-router-dom";

// ** Types

const ChefPendingList = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: DefaultFilter = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    sortOrder: "asc",
  };
  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams(stringifyObjectValues(defaultFilter)),
  );

  const [isLoading, setLoading] = useState(false);

  const [filter, setFilter] = useState<Filter<ChefFilterPending>>({
    index: Number(searchParams.get("index")) || defaultFilter.index,
    size: Number(searchParams.get("size")) || defaultFilter.size,
    level: (searchParams.get("level") as ChefLevel) || undefined,
    email: searchParams.get("email") || undefined,
    fullName: searchParams.get("fullName") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder:
      (searchParams.get("sortOrder") as SortOrder) || defaultFilter.sortOrder,
    total: Number(searchParams.get("total")),
  });

  const {
    isLoading: queryLoading,
    data: chefData,
    refetch,
  } = useQuery({
    queryKey: ["list-chef-pending", searchParams.toString()],
    queryFn: () => queryChefPending(searchParams.toString()),
    ...queryOptions,
  });
  const ids = {
    modalConfirmApprove: (id: string) => `modal-confirm-approve-${id}`,
    modalConfirmReject: (id: string) => `modal-confirm-reject-${id}`,
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

  function updateFilter(updates: Partial<Filter<ChefFilterPending>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

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
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
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

  const handleSearchChef = useDebouncedCallback(() => {
    const fullName = searchInputRef.current?.value.trim() || "";

    setFilter((prev) => ({
      ...prev,
      fullName,
    }));
  }, 300);

  useEffect(() => {
    if (chefData) {
      setChefs(chefData.data);
      setFilter((prev) => ({ ...prev, ...chefData.paginate }));
    }

    setLoading(queryLoading);
  }, [chefData]);

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams((params) => params);
    }

    const { total, ...truthyFilter } = getTruthyObject(filter);
    const params = new URLSearchParams(truthyFilter as Record<string, string>);
    setSearchParams(params);
  }, [filter]);

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "fullName" },
    { title: "Level", sortName: "level" },
    { title: "Description", sortName: "description" },
    { title: "Started Date", sortName: "startedDate" },
    { title: "Status", sortName: "status" },
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
              <Icon icon="mdi:close" />
              <Modal
                open={activeIds.includes(ids.modalConfirmReject(row.id))}
                onClose={() => removeId(ids.modalConfirmReject(row.id))}>
                <ConfirmBox
                  isLoading={isLoading}
                  variant="warning"
                  notificationContent={{
                    title: "Chef Application Rejected",
                    message: `Your application to become a chef has been rejected.`,
                    receiver: row.userInfo.id,
                  }}
                  boxContent={{
                    textSubmit: "Reject",
                    textTitle: `Reject Chef Application`,
                    textContent: `Are you sure you want to reject '${row.userInfo.fullName}' from becoming a chef? This action cannot be undone.`,
                  }}
                  onClick={() => handleApproveOrRejectChef(row.id, false)}
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
              <Icon icon="mdi:tick" />
              <Modal
                open={activeIds.includes(ids.modalConfirmApprove(row.id))}
                onClose={() => removeId(ids.modalConfirmApprove(row.id))}>
                <ConfirmBox
                  isLoading={isLoading}
                  variant="info"
                  notificationContent={{
                    title: "Chef Application Approved",
                    message: `Congratulations! Your application to become a chef has been approved.`,
                    receiver: row.userInfo.id,
                  }}
                  boxContent={{
                    textSubmit: "Approve",
                    textTitle: `Approve Chef Application`,
                    textContent: `Are you sure you want to approve '${row.userInfo.fullName}' as a chef? This action will grant them chef privileges.`,
                  }}
                  onClick={() => handleApproveOrRejectChef(row.id, true)}
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
            disabled={queryLoading && !chefs}
            placeholder="Search Chef"
            onChange={handleSearchChef}
            fullWidth
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
                disabled={queryLoading && !chefs}
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
                  width: { xs: "100%", md: 105 },
                },
              }}
              value={filter.level || ""}
              onChange={(event) =>
                updateFilter({
                  index: 1,
                  level: event.target.value as ChefLevel,
                })
              }
              menuItems={[
                { value: "Beginner", label: "Beginner" },
                { value: "Home Cook", label: "Home cook" },
                { value: "Professional", label: "Professional" },
                { value: "Master chef", label: "Master chef" },
              ]}
              defaultOption={"Select Level"}
              fullWidth
              isLoading={queryLoading && !chefs}
            />
            <Button
              sx={{
                height: 40,
                width: { xs: "100%", md: "max-content" },
                textWrap: "nowrap",
              }}
              disabled={queryLoading && !chefs}
              disableRipple
              color="error"
              variant="outlined"
              onClick={handleResetFilter}
              startIcon={<Icon icon="carbon:filter-reset" />}>
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Divider />
      <TableContainer>
        <ProgressBarLoading isLoading={isLoading} />
        <Table>
          <TableHead<ChefFilterPending>
            isLoading={queryLoading && !chefs}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody<Chef, ChefFilterPending>
            isLoading={queryLoading && !chefs}
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
        onChange={(_event, value) => {
          updateFilter({ index: value });
        }}
      />
    </Fragment>
  );
};
export default ChefPendingList;
