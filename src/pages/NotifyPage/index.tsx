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
  Tooltip,
  DatePicker,
  TextField,
} from "@/components/ui";
import { TableHead, TableBody, Pagination } from "@/components";
import { SearchInput } from "@/components/fields";
import BroadcastNotification from "./BroadcastNotification";
import NotifyDetail from "./NotifyDetail";
import ProgressBarLoading from "@/components/ui/ProgressBarLoading";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, useLocation } from "react-router-dom";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import {
  formatDateTime,
  getTruthyObject,
  shallowCompareObject,
  stringifyObjectValues,
} from "@/utils/helpers";

// ** Services
import { queryNotify } from "@/services/notifyService";
import dayjs, { Dayjs } from "dayjs";

const NotifyList = () => {
  const { state } = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: DefaultFilter & { receiverId: string } = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    sortOrder: "asc",
    receiverId: state ? state.receiverId : undefined,
  };

  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams(stringifyObjectValues(getTruthyObject(defaultFilter))),
  );

  // const { activeIds, addId, removeId } = useSettings();
  const ids = useMemo(
    () => ({
      modalDetail: (id: string) => `modal-notify-detail-${id}`,
      modalNotify: "modal-modal-notify",
    }),
    [],
  );

  const [notification, setNotification] = useState<Notify[]>();
  const fromDateParam = searchParams.get("fromDate");
  const toDateParam = searchParams.get("toDate");

  const [filter, setFilter] = useState<Filter<NotifyFilter>>({
    index: Number(searchParams.get("index")) || defaultFilter.index,
    size: Number(searchParams.get("size")) || defaultFilter.size,
    receiverId: searchParams.get("receiverId") || undefined,
    title: searchParams.get("title") || undefined,
    fromDate:
      fromDateParam && dayjs(fromDateParam).isValid()
        ? dayjs(fromDateParam).toISOString()
        : undefined,
    toDate:
      toDateParam && dayjs(toDateParam).isValid()
        ? dayjs(toDateParam).toISOString()
        : undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder:
      (searchParams.get("sortOrder") as SortOrder) || defaultFilter.sortOrder,
    total: Number(searchParams.get("total")),
  });

  const {
    data: notifyData,
    refetch,
    isLoading: queryLoading,
  } = useQuery({
    queryKey: ["list-notify", searchParams.toString()],
    queryFn: () => queryNotify(searchParams.toString()),
    ...queryOptions,
  });

  const { activeIds, addId, removeId } = useSettings();
  function updateFilter(updates: Partial<Filter<NotifyFilter>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  const handleSearchNotify = useDebouncedCallback(() => {
    const title = searchInputRef.current?.value.trim() || "";

    setFilter((prev) => ({
      ...prev,
      title,
    }));
  }, 300);

  function handleCancel(modalId: string) {
    removeId(modalId);
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

  useEffect(() => {
    if (notifyData) {
      setNotification(notifyData.data);
      setFilter((prev) => ({ ...prev, ...notifyData.paginate }));
    }
  }, [notifyData]);

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams((params) => params);
    }
    const { total, ...truthyFilter } = getTruthyObject(filter);
    const params = new URLSearchParams(truthyFilter as Record<string, string>);

    setSearchParams(params);
  }, [filter]);

  const HEAD_COLUMNS = [
    { title: "Title", sortName: "title" },
    { title: "Message", sortName: "message" },
    { title: "Created Date", sortName: "" },
    { title: "Created By", sortName: "" },
    { title: "Send To", sortName: "" },
    { title: "Sent To", sortName: "" },
    { title: "Read", sortName: "" },
    { title: "Unread", sortName: "" },
    { title: "", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<Notify>[] = [
    {
      render: ({ title }) => title,
    },
    {
      render: ({ message }) => message,
    },
    {
      render: ({ createdDate }) => formatDateTime(createdDate),
    },
    {
      render: ({ createdBy }) => createdBy.fullName,
    },
    {
      render: ({ sendTo }) => sendTo,
    },
    {
      render: ({ sentTo }) => sentTo,
    },
    {
      render: ({ read }) => read,
    },
    {
      render: ({ unread }) => unread,
    },

    {
      render: ({ id }) => (
        <Stack direction="row" alignItems="center">
          <Tooltip
            arrow
            title="Notify Details"
            disableHoverListener={activeIds.includes(ids.modalDetail(id))}>
            <IconButton
              onClick={() => {
                addId(ids.modalDetail(id));
              }}
              disableRipple>
              <Icon icon="hugeicons:view" />
              <Modal
                open={activeIds.includes(ids.modalDetail(id))}
                onClose={() => removeId(ids.modalDetail(id))}>
                <NotifyDetail
                  closeMenu={() => handleCancel(ids.modalDetail(id))}
                  notifyId={id}
                />
              </Modal>
            </IconButton>
          </Tooltip>
        </Stack>
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
            defaultValue={filter.title}
            ref={searchInputRef}
            disabled={queryLoading && !notification}
            placeholder="Search Notify"
            onChange={handleSearchNotify}
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
                disabled={queryLoading && !notification}
                onChange={(event) =>
                  updateFilter({ index: 1, size: Number(event.target.value) })
                }
                value={filter.size}
                menuItems={pageSizeOptions}
              />
            </Stack>
            <Stack
              sx={{
                alignItems: "center",
                gap: "0.75rem",
                flexDirection: "row",
              }}>
              <DatePicker
                sx={{
                  "&": { height: 40 },
                  "& .MuiInputBase-input": { width: "100px" },
                }}
                disabled={false}
                onChange={(date: Dayjs | null) => {
                  if (date) {
                    if (filter.toDate) {
                      const toDate = new Date(filter.toDate);
                      const fromDate = new Date(date.toISOString());

                      if (fromDate.getTime() >= toDate.getTime()) {
                        updateFilter({
                          index: 1,
                          toDate: undefined,
                        });
                      }
                    }

                    updateFilter({
                      index: 1,
                      fromDate: date.toISOString(),
                    });
                  }
                }}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    value: filter.fromDate ? dayjs(filter.fromDate) : null,
                  },
                }}
              />
              <Box
                sx={{
                  height: "1px",
                  width: 22,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light" ? "#000" : "#fff",
                }}
              />
              <DatePicker
                sx={{
                  "&": { height: 40 },
                  "& .MuiInputBase-input": { width: "100px" },
                }}
                onChange={(date: Dayjs | null) => {
                  if (date) {
                    if (!filter.fromDate) {
                      updateFilter({
                        index: 1,
                        fromDate: date.toISOString(),
                      });
                      return;
                    }

                    const fromDate = new Date(filter.fromDate);
                    const toDate = new Date(date.toISOString());
                    if (fromDate.getTime() >= toDate.getTime()) {
                      updateFilter({
                        index: 1,
                        fromDate: date.toISOString(),
                      });
                      updateFilter({
                        index: 1,
                        toDate: undefined,
                      });
                    } else {
                      updateFilter({
                        index: 1,
                        toDate: date.toISOString(),
                      });
                    }
                  }
                }}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    value: filter.toDate ? dayjs(filter.toDate) : null,
                  },
                }}
              />
            </Stack>
            <Button
              sx={{
                height: 40,
                width: { xs: "100%", md: "max-content" },
                textWrap: "nowrap",
              }}
              disabled={queryLoading && !notification}
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
              disabled={queryLoading && !notification}
              disableRipple
              variant="contained"
              onClick={() => addId(ids.modalNotify)}>
              <Icon icon="mdi:bell-outline" />
              <Modal
                open={activeIds.includes(ids.modalNotify)}
                onClose={() => removeId(ids.modalNotify)}>
                <BroadcastNotification
                  closeMenu={() => handleCancel(ids.modalNotify)}
                />
              </Modal>
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Divider />
      <TableContainer>
        <ProgressBarLoading isLoading={queryLoading} />
        <Table>
          <TableHead
            isLoading={queryLoading && !notification}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody
            isLoading={queryLoading && !notification}
            data={notification}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={notification?.length}
        isLoading={queryLoading && !notification}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        onChange={(_event: ChangeEvent<unknown>, value: number) => {
          updateFilter({ index: value });
        }}
      />
    </Fragment>
  );
};
export default NotifyList;
