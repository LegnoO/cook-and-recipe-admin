// ** React Imports
import { ChangeEvent, useState, useEffect, Fragment, useMemo } from "react";

// ** Mui Imports
import {
  Box,
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
  ChipStatus,
  ConfirmBox,
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

const ListRecipe = () => {
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

  const [recipes, setRecipes] = useState<RecipePending[] | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);
  const [filter, setFilter] = useState<Filter<FilterRecipe>>(defaultFilter);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const {
    data: recipeData,

  } = useQuery({
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

  function handleCloseAction(id: string) {
    removeId(ids.modalAction(id));
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

  function handleToggleAction(id: string) {
    addId(ids.modalAction(id));
  }

  const handleSearchGroup = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilter((prev) => ({ ...prev, name: event.target.value }));
    },
    300,
  );

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

  const BODY_CELLS: BodyCell<RecipePending>[] = [
    {
      render: (row: RecipePending) => row.name,
    },
    {
      render: (row: RecipePending) => row.difficulty,
    },
    {
      render: (row: RecipePending) => formatDateTime(row.createdDate),
    },
    {
      render: (row: RecipePending) => row.createdBy.fullName,
    },
    {
      render: (row: RecipePending) => (
        <ChipStatus
          label={row.status ? "Public" : "Private"}
          variant={row.status ? "active" : "disabled"}
        />
      ),
    },
    {
      render: (row: RecipePending) => (
        <ChipStatus
          label={row.verifyStatus}
          variant={row.verifyStatus === "rejected" ? "error" : "success"}
        />
      ),
    },
    {
      render: (row: RecipePending) => (
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
                    handleCloseAction(row.id);
                    addId(ids.modalDetail(row.id));
                  }}>
                  <IconButton sx={{ p: 0, m: 0 }} disableRipple>
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
                  <Typography color="text.secondary">View Recipe</Typography>
                </Stack>

                <Stack
                  alignItems="center"
                  direction="row"
                  sx={{
                    gap: "0.5rem",
                    zIndex: 2102,
                  }}
                  onClick={() => {
                    handleCloseAction(row.id);
                    addId(ids.modalRevoke(row.id));
                  }}>
                  <IconButton sx={{ p: 0, m: 0 }} disableRipple>
                    <Icon icon="icon-park-outline:undo" />
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
                  <Typography color="text.secondary">
                    Revoke Verification
                  </Typography>
                </Stack>

                <Stack
                  alignItems="center"
                  direction="row"
                  sx={{
                    gap: "0.5rem",
                    zIndex: 2103,
                  }}
                  onClick={() => {
                    handleCloseAction(row.id);
                    addId(ids.modalPrivate(row.id));
                  }}>
                  <IconButton sx={{ p: 0, m: 0 }} disableRipple>
                    <Icon icon="material-symbols:lock-outline" />
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
                  <Typography color="text.secondary">Private Recipe</Typography>
                </Stack>
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
        <Box sx={{ p: 2.5 }}>
          <Stack
            sx={{
              width: "100%",
              gap: 2,
              flexWrap: "wrap",
            }}
            direction={"row"}
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}>
            <Stack
              sx={{ flex: { xs: 1, sm: "none" } }}
              direction="row"
              alignItems="center"
              spacing={1.5}>
              <Typography>Show</Typography>
              <Select
                sx={{
                  height: 42,

                  minWidth: { sm: 70 },
                }}
                fullWidth
                disabled={isLoading}
                onChange={handleChangeRowPageSelector}
                value={filter.size}
                menuItems={pageSizeOptions}
              />
            </Stack>
            <SearchInput
              disabled={isLoading}
              placeholder="Search Recipe"
              onChange={handleSearchGroup}
              fullWidth
              sx={{ maxWidth: { xs: "100%", sm: 170 } }}
            />
            <Select
              sx={{ maxWidth: { xs: "100%", sm: 150 } }}
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
              sx={{ maxWidth: { xs: "100%", sm: 180 } }}
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
              sx={{ maxWidth: { xs: "100%", sm: 140 } }}
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
            <Button
              fullWidth
              sx={{ maxWidth: { xs: "100%", sm: "max-content" } }}
              disabled={isLoading}
              disableRipple
              color="error"
              variant="outlined"
              onClick={handleResetFilter}
              startIcon={<Icon icon="carbon:filter-reset" />}>
              Reset Filter
            </Button>
          </Stack>
        </Box>
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
export default ListRecipe;
