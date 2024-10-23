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
  Tooltip,
  ConfirmBox,
} from "@/components/ui";
import { TableHead, TableBody, Pagination } from "@/components";
import { SearchInput } from "@/components/fields";

// ** Library Imports
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Component's
import RecipeDetail from "./RecipeDetail";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import { formatDateTime, handleToastMessages } from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";

// ** Services
import {
  queryRecipePending,
  toggleRecipeRequest,
} from "@/services/recipeService";

const RecipePendingList = () => {
  const pageSizeOptions = ["10", "15", "20"];
  const defaultFilter: Filter<FilterRecipePending> = {
    index: 1,
    size: Number(pageSizeOptions[0]),
    total: null,
    name: "",
    difficulty: null,
    sortBy: "",
    sortOrder: "",
  };

  const { activeIds, addId, removeId } = useSettings();
  const ids = useMemo(
    () => ({
      modalDetail: (id: string) => `modal-Detail-${id}`,
      modalConfirmApprove: (id: string) => `modal-confirm-Approve-${id}`,
      modalConfirmReject: (id: string) => `modal-confirm-reject-${id}`,
    }),
    [],
  );

  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);
  const [filter, setFilter] =
    useState<Filter<FilterRecipePending>>(defaultFilter);

  const { data: recipeData, refetch } = useQuery({
    queryKey: [
      "list-recipe-pending",
      filter.index,
      filter.size,
      filter.name,
      filter.difficulty,
      filter.sortBy,
      filter.sortOrder,
    ],
    queryFn: () => queryRecipePending(filter),
    ...queryOptions,
  });

  const [isLoading, setLoading] = useState(false);

  function updateFilter(updates: Partial<Filter<FilterRecipePending>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  function handleChangePage(_event: ChangeEvent<unknown>, value: number) {
    updateFilter({ index: value });
  }

  function handleFilterChange(
    event: ChangeEvent<HTMLInputElement>,
    field: keyof Filter<FilterRecipePending>,
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
    setFilter({ ...defaultFilter, ...recipeData?.paginate });
  }

  async function handleApproveOrRejectRecipe(
    recipeId: string,
    status: boolean,
  ) {
    setLoading(true);
    const toastLoading = toast.loading("Loading...");

    const toastMessage = status
      ? "Approve successfully"
      : "Reject successfully";

    try {
      await toggleRecipeRequest(recipeId, status);
      toast.success(toastMessage);
      refetch();
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
    } finally {
      if (status) {
        handleCancel(ids.modalConfirmApprove(recipeId));
      } else {
        handleCancel(ids.modalConfirmReject(recipeId));
      }
      setLoading(false);
      toast.dismiss(toastLoading);
    }
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
    { title: "Cook Time", sortName: "timeToCook" },
    { title: "Serves", sortName: "serves" },
    { title: "Created Date", sortName: "createdDate" },
    { title: "Created By", sortName: "createdBy" },
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
      align: "center",
      render: (row: Recipe) => row.timeToCook,
    },
    {
      align: "center",
      render: (row: Recipe) => row.serves,
    },
    {
      render: (row: Recipe) => formatDateTime(row.createdDate),
    },
    {
      render: (row: Recipe) => row.createdBy.fullName,
    },
    {
      render: (row: Recipe) => (
        <Fragment>
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
                <RecipeDetail
                  closeMenu={() => handleCancel(ids.modalDetail(row.id))}
                  recipeId={row.id}
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
                    textTitle={`Confirm reject recipe ${row.name}`}
                    textContent={`You're about to reject recipe '${row.name}'. Are you sure?`}
                    onClick={async () => {
                      await handleApproveOrRejectRecipe(row.id, false);
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
                    textTitle={`Confirm approve ${row.name}`}
                    textContent={`You're about to approve recipe '${row.name}'. Are you sure?`}
                    onClick={async () => {
                      await handleApproveOrRejectRecipe(row.id, true);
                    }}
                    onClose={() =>
                      handleCancel(ids.modalConfirmApprove(row.id))
                    }
                  />
                </Modal>
              </IconButton>
            </Tooltip>
          </Stack>
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
              sx={{ height: 40, width: 65 }}
              fullWidth
              disabled={isLoading}
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
              disabled={isLoading}
              placeholder="Search Recipe"
              onChange={handleSearchGroup}
              fullWidth
              sx={{
                height: 40,
                width: { xs: "100%", sm: 170 },
              }}
            />
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
            <Button
              sx={{
                height: 40,
                minWidth: "max-content",
              }}
              disabled={isLoading}
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
export default RecipePendingList;
