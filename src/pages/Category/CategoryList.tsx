// ** React Imports
import { ChangeEvent, useState, useEffect, Fragment, useMemo } from "react";

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
import CategoryUpdate from "./CategoryUpdate";
import CategoryDetail from "./CategoryDetail";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import { formatDateTime, handleToastMessages } from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Services
import {
  queryCategory,
  toggleStatusCategory,
} from "@/services/categoryService";

const CategoryList = () => {
  const { activeIds, addId, removeId } = useSettings();
  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: Filter<FilterCategory> = {
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
      modalUpdate: (id: string) => `modal-update-${id}`,
      modalDetail: (id: string) => `modal-detail-${id}`,
    }),
    [],
  );

  const [category, setCategory] = useState<Category[] | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);
  const [filter, setFilter] = useState<Filter<FilterCategory>>(defaultFilter);

  const {
    isLoading,
    data: categoryData,
    refetch,
  } = useQuery({
    queryKey: [
      "list-category",
      filter.index,
      filter.size,
      filter.name,
      filter.status,
      filter.sortBy,
      filter.sortOrder,
    ],
    queryFn: () => queryCategory(filter),
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

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    updateFilter({ index: value });
  }

  function handleFilterChange(
    event: ChangeEvent<HTMLInputElement>,
    field: keyof Filter<FilterCategory>,
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
    setFilter({ ...defaultFilter, ...categoryData?.paginate });
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

  const HEAD_COLUMNS = [
    { title: "Categories", sortName: "name" },
    { title: "Created Date", sortName: "createdDate" },
    { title: "Updated Date", sortName: "updatedDate" },
    { title: "Created By", sortName: "" },
    { title: "Status", sortName: "status" },
    { title: "", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<Category>[] = [
    {
      render: (row: Category) => row.name,
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
          sx={{ flexWrap: "wrap", gap: 2, p: 3 }}
          direction={{
            xs: "column",
            lg: "row",
          }}
          alignItems={"center"}
          justifyContent="space-between">
          <SearchInput
            disabled={isLoading}
            placeholder="Search Category"
            onChange={handleSearchGroup}
            fullWidth
            sx={{ height: 40, maxWidth: { xs: "100%", lg: 190 } }}
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
            data={category}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={category?.length}
        isLoading={isLoading}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        handlePaginateChange={handleChangePage}
      />
    </Fragment>
  );
};
export default CategoryList;
