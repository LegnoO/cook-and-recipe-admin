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
  ChipStatus,
  ConfirmBox,
  Tooltip,
  DatePicker,
  TextField,
} from "@/components/ui";
import { TableHead, TableBody, Pagination } from "@/components";
import { SearchInput } from "@/components/fields";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams } from "react-router-dom";

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

  // const { activeIds, addId, removeId } = useSettings();
  const ids = useMemo(
    () => ({
      modalDetail: (id: string) => `modal-detail-${id}`,
    }),
    [],
  );

  const [notification, setNotification] = useState<Notify[]>();
  const [filter, setFilter] = useState<Filter<NotifyFilter>>({
    index: Number(searchParams.get("index")) || defaultFilter.index,
    size: Number(searchParams.get("size")) || defaultFilter.size,
    receiverId: searchParams.get("receiverId") || undefined,
    title: searchParams.get("title") || undefined,
    fromDate: dayjs(searchParams.get("fromDate")).isValid()
      ? dayjs(searchParams.get("fromDate")).toISOString()
      : undefined,
    toDate: dayjs(searchParams.get("toDate")).isValid()
      ? dayjs(searchParams.get("toDate")).toISOString()
      : undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder:
      (searchParams.get("sortOrder") as SortOrder) || defaultFilter.sortOrder,
    total: Number(searchParams.get("total")),
  });
  console.log({ filter });
  const {
    data: notifyData,
    refetch,
    isLoading: queryLoading,
  } = useQuery({
    queryKey: ["list-notify", searchParams.toString()],
    queryFn: () => queryNotify(searchParams.toString()),
    ...queryOptions,
  });
  console.log({ notifyData });
  const [isLoading, setLoading] = useState(false);

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

    setLoading(queryLoading);
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

    // {
    //   render: ({ id }) => (
    //     <Stack direction="row" alignItems="center">
    //       <Tooltip
    //         arrow
    //         title={"Recipe Details"}
    //         disableHoverListener={activeIds.includes(ids.modalDetail(id))}>
    //         <IconButton
    //           onClick={() => {
    //             addId(ids.modalDetail(id));
    //           }}
    //           disableRipple>
    //           <Icon icon="hugeicons:view" />
    //           <Modal
    //             open={activeIds.includes(ids.modalDetail(id))}
    //             onClose={() => removeId(ids.modalDetail(id))}>
    //             <NotifyDetail
    //               closeMenu={() => handleCancel(ids.modalDetail(id))}
    //               notifyId={id}
    //             />
    //           </Modal>
    //         </IconButton>
    //       </Tooltip>
    //     </Stack>
    //   ),
    // },
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
                value={filter.fromDate ? dayjs(filter.fromDate) : null}
                onChange={(date: Dayjs | null) => {
                  updateFilter({
                    index: 1,
                    fromDate: date ? date.toISOString() : undefined,
                  });
                }}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    // helperText: error ? error.message : null,
                    // error: !!error,
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
                disabled={false}
                value={filter.fromDate ? dayjs(filter.fromDate) : null}
                onChange={(date: Dayjs | null) => {
                  updateFilter({
                    index: 1,
                    fromDate: date ? date.toISOString() : undefined,
                  });
                }}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    // helperText: error ? error.message : null,
                    // error: !!error,
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
          </Stack>
        </Stack>
      </Paper>
      <Divider />
      <TableContainer>
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
