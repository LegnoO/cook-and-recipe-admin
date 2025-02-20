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
  Avatar,
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
import ProgressBarLoading from "@/components/ui/ProgressBarLoading";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import CategoryUpdate from "./CategoryUpdate";
import CategoryDetail from "./CategoryDetail";
import CategoryAdd from "./CategoryAdd";

// ** Hooks
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

// ** Services
import {
  queryCategory,
  toggleStatusCategory,
} from "@/services/categoryService";

const CategoryList = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { activeIds, addId, removeId } = useSettings();
  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: DefaultFilter = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    sortOrder: "asc",
  };

  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams(stringifyObjectValues(defaultFilter)),
  );

  const ids = useMemo(
    () => ({
      modalUpdate: (id: string) => `modal-update-${id}`,
      modalDetail: (id: string) => `modal-detail-${id}`,
      newCategoryModal: "new-category-modal",
    }),
    [],
  );

  const [category, setCategory] = useState<Category[]>();
  const [controller, setController] = useState<AbortController | null>(null);
  const [filter, setFilter] = useState<Filter<FilterCategory>>({
    index: Number(searchParams.get("index")) || defaultFilter.index,
    size: Number(searchParams.get("size")) || defaultFilter.size,
    status: searchParams.get("status") || undefined,
    name: searchParams.get("name") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder:
      (searchParams.get("sortOrder") as SortOrder) || defaultFilter.sortOrder,
    total: Number(searchParams.get("total")),
  });

  const {
    isLoading,
    data: categoryData,
    refetch,
  } = useQuery({
    queryKey: ["list-category", searchParams.toString()],
    queryFn: () => queryCategory(searchParams.toString()),
    ...queryOptions,
  });

  async function handleChangeStatus(groupId: string) {
    try {
      addId(`loading-switch-${groupId}`);
      await toggleStatusCategory(groupId);
      setCategory(
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

  function updateFilter(updates: Partial<Filter<FilterCategory>>) {
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

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData.data);
      setFilter((prev) => ({ ...prev, ...categoryData.paginate }));
    }
  }, [categoryData]);

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams((params) => params);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { total, ...truthyFilter } = getTruthyObject(filter);
    const params = new URLSearchParams(truthyFilter as Record<string, string>);
    setSearchParams(params);
  }, [filter, searchParams.size, setSearchParams]);

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "name" },
    { title: "Created Date", sortName: "createdDate" },
    { title: "Updated Date", sortName: "updatedDate" },
    { title: "Created By", sortName: "" },
    { title: "Status", sortName: "status" },
    { title: "", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<Category>[] = [
    {
      render: (row: Category) => (
        <Stack direction="row" spacing={1.25} alignItems={"center"}>
          <Avatar
            src={
              row.imageUrl ||
              "https://pivoo.themepreview.xyz/home-three/wp-content/uploads/sites/4/2024/04/raspberry-2023404_1920.jpg"
            }
            alt="Avatar user"
          />

          <Typography
            sx={{ whiteSpace: "nowrap" }}
            fontWeight="500"
            color="text.primary">
            {row.name}
          </Typography>
        </Stack>
      ),
    },
    {
      render: (row: Category) => formatDateTime(row.createdDate),
    },
    {
      render: (row: Category) =>
        row.updatedDate ? formatDateTime(row.updatedDate) : "not update yet",
    },
    {
      render: (row: Category) => row.createdBy.fullName,
    },
    {
      render: (row: Category) => (
        <Switch
          color="success"
          onChange={() => handleChangeStatus(row.id)}
          disabled={activeIds.includes(`loading-switch-${row.id}`)}
          checked={
            category?.find((categoryItem) => categoryItem.id === row.id)?.status
          }
        />
      ),
    },
    {
      render: (row: Category) => (
        <Stack direction="row" alignItems={"center"}>
          <IconButton
            onClick={() => {
              addId(ids.modalDetail(row.id));
            }}
            disableRipple>
            <Icon icon="hugeicons:view" />
            <Modal
              open={activeIds.includes(ids.modalDetail(row.id))}
              onClose={() => removeId(ids.modalDetail(row.id))}>
              <CategoryDetail
                closeMenu={() => handleCancel(ids.modalDetail(row.id))}
                categoryId={row.id}
              />
            </Modal>
          </IconButton>
          <IconButton
            disableRipple
            onClick={() => addId(ids.modalUpdate(row.id))}>
            <Icon icon="heroicons:pencil-solid" />
            <Modal
              open={activeIds.includes(ids.modalUpdate(row.id))}
              onClose={() => removeId(ids.modalUpdate(row.id))}>
              <CategoryUpdate
                categoryId={row.id}
                refetch={refetch}
                closeMenu={() => handleCancel(ids.modalUpdate(row.id))}
                setController={setController}
              />
            </Modal>
          </IconButton>
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
            defaultValue={filter.name}
            ref={searchInputRef}
            disabled={isLoading && !category}
            placeholder="Search Category"
            onChange={handleSearchGroup}
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
                disabled={isLoading && !category}
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
              value={filter.status || ""}
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
              isLoading={isLoading && !category}
            />
            <Button
              sx={{
                height: 40,
                width: { xs: "100%", md: "max-content" },
                textWrap: "nowrap",
              }}
              disabled={isLoading && !category}
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
              disabled={isLoading && !category}
              disableRipple
              variant="contained"
              startIcon={<Icon icon="ic:sharp-plus" />}
              onClick={() => addId(ids.newCategoryModal)}>
              Add Category
              <Modal
                open={activeIds.includes(ids.newCategoryModal)}
                onClose={() => removeId(ids.newCategoryModal)}>
                <CategoryAdd
                  refetch={refetch}
                  closeMenu={() => handleCancel(ids.newCategoryModal)}
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
            isLoading={isLoading && !category}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody
            isLoading={isLoading && !category}
            data={category}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={category?.length}
        isLoading={isLoading && !category}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        onChange={(_event: ChangeEvent<unknown>, value: number) => {
          updateFilter({ index: value });
        }}
      />
    </Fragment>
  );
};
export default CategoryList;
