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
import { Stack, Typography, Button, Divider, IconButton } from "@mui/material";

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

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import RecipeDetail from "./RecipeDetail";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import { formatDateTime } from "@/utils/helpers";

// ** Services
import {
  queryRecipe,
  revokeApprovalRecipe,
  privateRecipe,
} from "@/services/recipeService";

const RecipeList = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: Filter<FilterRecipe> = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    total: null,
    name: "",
    difficulty: null,
    verifyStatus: null,
    status: null,
    sortBy: "",
    sortOrder: "",
  };

  const { activeIds, addId, removeId } = useSettings();
  const ids = useMemo(
    () => ({
      modalDetail: (id: string) => `modal-detail-${id}`,
      modalRevoke: (id: string) => `modal-revoke-${id}`,
      modalPrivate: (id: string) => `modal-private-${id}`,
      modalAction: (id: string) => `modal-action-${id}`,
    }),
    [],
  );

  const [recipes, setRecipes] = useState<Recipe[]>();
  const [controller, setController] = useState<AbortController | null>(null);
  const [filter, setFilter] = useState<Filter<FilterRecipe>>(defaultFilter);

  const { data: recipeData } = useQuery({
    queryKey: [
      "list-recipe",
      filter.index,
      filter.size,
      filter.name,
      filter.difficulty,
      filter.verifyStatus,
      filter.status,
      filter.sortBy,
      filter.sortOrder,
    ],
    queryFn: () => queryRecipe(filter),
    ...queryOptions,
  });

  const [isLoading, _setLoading] = useState(false);

  function updateFilter(updates: Partial<Filter<FilterRecipe>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    updateFilter({ index: value });
  }

  function handleFilterChange(
    event: ChangeEvent<HTMLInputElement>,
    field: keyof Filter<FilterRecipe>,
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

  const searchDebounced = useDebouncedCallback(() => {
    if (searchInputRef.current) {
      setFilter((prev) => ({
        ...prev,
        name: searchInputRef.current!.value,
      }));
    }
  }, 300);

  const handleSearchRecipe = () => {
    searchDebounced();
  };

  function handleResetFilter() {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setFilter({ ...defaultFilter, ...recipeData?.paginate });
  }

  function handleCancel(modalId: string) {
    if (controller) {
      controller.abort();
      setController(null);
    }
    removeId(modalId);
  }

  useEffect(() => {
    if (recipeData) {
      setRecipes(recipeData.data);
      setFilter((prev) => ({ ...prev, ...recipeData.paginate }));
    }
  }, [recipeData]);

  const HEAD_COLUMNS = [
    { title: "Recipe Name", sortName: "name" },
    { title: "Difficulty", sortName: "difficulty" },
    { title: "Approve Date", sortName: "approvedDate" },
    { title: "Approve By", sortName: "approvedBy" },
    { title: "Verify Status", sortName: "verifyStatus" },
    { title: "Share Status", sortName: "status" },
    { title: "", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<Recipe>[] = [
    {
      render: (row: Recipe) => row.name,
    },
    {
      render: (row: Recipe) => row.difficulty,
    },
    {
      render: (row: Recipe) => formatDateTime(row.createdDate),
    },
    {
      render: (row: Recipe) => row.approvalBy.fullName,
    },
    {
      render: (row: Recipe) => (
        <ChipStatus
          label={row.status ? "Public" : "Private"}
          variant={row.status ? "active" : "disabled"}
        />
      ),
    },
    {
      render: (row: Recipe) => (
        <ChipStatus
          label={row.verifyStatus}
          variant={row.verifyStatus === "rejected" ? "error" : "success"}
        />
      ),
    },
    {
      render: (row: Recipe) => (
        <Stack direction="row" alignItems="center">
          <Tooltip
            arrow
            title={"Recipe Details"}
            disableHoverListener={activeIds.includes(ids.modalDetail(row.id))}>
            <IconButton
              onClick={() => {
                addId(ids.modalDetail(row.id));
              }}
              disableRipple>
              <Icon icon="hugeicons:view" />
              <Modal
                open={activeIds.includes(ids.modalDetail(row.id))}
                onClose={() => removeId(ids.modalDetail(row.id))}>
                <RecipeDetail
                  closeMenu={() => handleCancel(ids.modalDetail(row.id))}
                  recipeId={row.id}
                />
              </Modal>
            </IconButton>
          </Tooltip>
          <Tooltip
            arrow
            title={"Revoke Verification"}
            disableHoverListener={activeIds.includes(ids.modalRevoke(row.id))}>
            <IconButton
              onClick={() => {
                addId(ids.modalRevoke(row.id));
              }}
              disableRipple>
              <Icon icon={"icon-park-outline:undo"} />
              <Modal
                open={activeIds.includes(ids.modalRevoke(row.id))}
                onClose={() => removeId(ids.modalRevoke(row.id))}>
                <ConfirmBox
                  isLoading={isLoading}
                  variant={"warning"}
                  textSubmit={"Yes, revoke !"}
                  textTitle={`Confirm revoke recipe ${row.name}`}
                  textContent={`You're about to revoke recipe '${row.name}'. Are you sure?`}
                  onClick={async () => {
                    await revokeApprovalRecipe(row.id);
                  }}
                  onClose={() => handleCancel(ids.modalRevoke(row.id))}
                />
              </Modal>
            </IconButton>
          </Tooltip>
          <Tooltip
            arrow
            title={"Private Recipe"}
            disableHoverListener={activeIds.includes(ids.modalPrivate(row.id))}>
            <IconButton
              onClick={() => {
                addId(ids.modalPrivate(row.id));
              }}
              disableRipple>
              <Icon icon={"material-symbols:lock-outline"} />
              <Modal
                open={activeIds.includes(ids.modalPrivate(row.id))}
                onClose={() => removeId(ids.modalPrivate(row.id))}>
                <ConfirmBox
                  isLoading={isLoading}
                  variant={"warning"}
                  textSubmit={"Yes, private !"}
                  textTitle={`Confirm private recipe ${row.name}`}
                  textContent={`You're about to private recipe '${row.name}'. Are you sure?`}
                  onClick={async () => {
                    await privateRecipe(row.id);
                  }}
                  onClose={() => handleCancel(ids.modalPrivate(row.id))}
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
              value={filter.difficulty || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(event, "difficulty")
              }
              menuItems={[
                { value: "Easy", label: "Easy" },
                { value: "Medium", label: "Medium" },
                { value: "Hard", label: "Hard" },
                { value: "Professional", label: "Professional" },
                { value: "Expert", label: "Expert" },
              ]}
              defaultOption={"Select Difficulty"}
              fullWidth
              isLoading={isLoading}
            />
            <Select
              value={filter.verifyStatus || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(event, "verifyStatus")
              }
              menuItems={[
                { value: "verified", label: "Verified" },
                { value: "rejected", label: "Rejected" },
              ]}
              defaultOption={"Select Verify Status"}
              fullWidth
              isLoading={isLoading}
            />
            <Select
              value={filter.status || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(event, "status")
              }
              menuItems={[
                { value: "true", label: "Public" },
                { value: "false", label: "Private" },
              ]}
              defaultOption={"Select Status"}
              fullWidth
              isLoading={isLoading}
            />
          </Stack>
        </Stack>
        <Divider />
        <Stack
          sx={{ flexWrap: "wrap", gap: 2, p: 3 }}
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems={"center"}
          justifyContent="space-between">
          <SearchInput
            ref={searchInputRef}
            disabled={isLoading}
            placeholder="Search Recipe"
            onChange={handleSearchRecipe}
            fullWidth
            sx={{ height: 40, maxWidth: { xs: "100%", sm: 170 } }}
          />

          <Stack
            sx={{ width: { xs: "100%", sm: "fit-content" } }}
            spacing={2}
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={"center"}>
            <Stack
              sx={{ width: { xs: "100%", sm: "fit-content" }, gap: 1.5 }}
              direction="row"
              alignItems="center">
              <Typography>Show</Typography>
              <Select
                sx={{ height: 40, width: { xs: "100%", sm: 65 } }}
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
                minWidth: { xs: "100%", lg: "max-content" },
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
            data={recipes}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={recipes?.length}
        isLoading={isLoading}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        handlePaginateChange={handleChangePage}
      />
    </Fragment>
  );
};
export default RecipeList;
