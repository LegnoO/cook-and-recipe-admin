// ** React Imports
import { useState, useEffect, Fragment, useRef } from "react";

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
import { queryChef, disableChef, activeChef } from "@/services/chefService";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

// ** Context
import useSettings from "@/hooks/useSettings";

// ** Component's
import ChefDetail from "./ChefDetail";

// ** Utils
import {
  formatDateTime,
  getTruthyObject,
  handleToastMessages,
  shallowCompareObject,
  stringifyObjectValues,
} from "@/utils/helpers";

// ** Config
import { queryOptions } from "@/config/query-options";
import { handleAxiosError } from "@/utils/errorHandler";
import { useSearchParams } from "react-router-dom";

// ** Types

const ListChefPending = () => {
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

  const [isLoading, setLoading] = useState(false);

  const [filter, setFilter] = useState<Filter<ChefFilter>>({
    index: Number(searchParams.get("index")) || defaultFilter.index,
    size: Number(searchParams.get("size")) || defaultFilter.size,
    level: (searchParams.get("level") as ChefLevel) || undefined,
    chefStatus: (searchParams.get("chefStatus") as ChefStatus) || undefined,
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
    queryKey: ["list-chef", searchParams.toString()],
    queryFn: () => queryChef(searchParams.toString()),
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

  function updateFilter(updates: Partial<Filter<ChefFilter>>) {
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

  const handleSearchChef = useDebouncedCallback(() => {
    const fullName = searchInputRef.current?.value.trim() || "";

    setFilter((prev) => ({
      ...prev,
      fullName,
    }));
  }, 300);

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
                  boxContent={{
                    textSubmit:
                      row.status === "banned" ? "Yes, Unban!" : "Yes, Ban!",
                    textTitle: `${row.status === "banned" ? "Unban" : "Ban"} Confirmation`,
                    textContent: `Are you sure you want to ${row.status === "banned" ? "unban" : "ban"} '${row.userInfo.fullName}'? This action ${row.status === "banned" ? "will restore their access." : "will restrict their access."}`,
                  }}
                  isLoading={isLoading}
                  variant={row.status === "banned" ? "success" : "error"}
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
              onChange={(event) =>
                updateFilter({
                  index: 1,
                  chefStatus: event.target.value as ChefStatus,
                })
              }
              menuItems={[
                { label: "Active", value: "active" },
                { label: "Disabled", value: "disabled" },

                { label: "Rejected", value: "rejected" },
                { label: "Banned", value: "banned" },
              ]}
              defaultOption="Select Status"
              fullWidth
              isLoading={queryLoading && !chefs}
            />
            <Select
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
              isLoading={queryLoading}
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
            disabled={queryLoading && !chefs}
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
                disabled={queryLoading && !chefs}
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
              disabled={queryLoading && !chefs}
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
        <ProgressBarLoading isLoading={isLoading} />
        <Table>
          <TableHead<ChefFilter>
            isLoading={queryLoading}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody<Chef, ChefFilter>
            isLoading={queryLoading}
            data={chefs}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={chefs?.length}
        isLoading={queryLoading && !chefs}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        onChange={(_event, value) => {
          updateFilter({ index: value });
        }}
      />
    </Fragment>
  );
};
export default ListChefPending;
