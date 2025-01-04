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
  Tooltip,
  ConfirmBox,
  Image,
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
  queryRecipePending,
  toggleRecipeRequest,
} from "@/services/recipeService";
import { useSearchParams } from "react-router-dom";

const RecipePendingList = () => {
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

  const { activeIds, addId, removeId } = useSettings();
  const ids = useMemo(
    () => ({
      modalDetail: (id: string) => `modal-Detail-${id}`,
      modalConfirmApprove: (id: string) => `modal-confirm-Approve-${id}`,
      modalConfirmReject: (id: string) => `modal-confirm-reject-${id}`,
    }),
    [],
  );

  const [recipes, setRecipes] = useState<Recipe[]>();
  const [controller, setController] = useState<AbortController | null>(null);
  const [filter, setFilter] = useState<Filter<FilterRecipePending>>({
    index: Number(searchParams.get("index")) || defaultFilter.index,
    size: Number(searchParams.get("size")) || defaultFilter.size,
    difficulty: (searchParams.get("difficulty") as Difficulty) || undefined,
    name: searchParams.get("fullName") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder:
      (searchParams.get("sortOrder") as SortOrder) || defaultFilter.sortOrder,
    total: Number(searchParams.get("total")),
  });

  const {
    data: recipeData,
    refetch,
    isLoading: queryLoading,
  } = useQuery({
    queryKey: ["list-recipe-pending", searchParams.toString()],
    queryFn: () => queryRecipePending(searchParams.toString()),
    ...queryOptions,
  });

  const [isLoading, setLoading] = useState(false);

  function updateFilter(updates: Partial<Filter<FilterRecipePending>>) {
    setFilter((prev) => ({ ...prev, ...updates }));
  }

  const handleSearchRecipe = useDebouncedCallback(() => {
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

    setLoading(queryLoading);
  }, [recipeData]);

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams((params) => params);
    }
    const { total, ...truthyFilter } = getTruthyObject(filter);
    const params = new URLSearchParams(truthyFilter as Record<string, string>);
    setSearchParams(params);
  }, [filter]);

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "name" },
    { title: "Difficulty", sortName: "difficulty" },
    { title: "Cook Time", sortName: "timeToCook" },
    { title: "Serves", sortName: "serves" },
    { title: "Created Date", sortName: "createdDate" },
    { title: "Created By", sortName: "createdBy" },
    { title: "", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<Recipe>[] = [
    {
      render: (row: Recipe) => (
        <Stack direction="row" spacing={1.25} alignItems={"center"}>
          <Image
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: (theme) => `${theme.shape.borderRadius}px`,
            }}
            src={
              row.imageUrls[0] ||
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
      render: (row: Recipe) => row.createdBy.userInfo.fullName,
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
                <Icon icon="mdi:close" />
                <Modal
                  open={activeIds.includes(ids.modalConfirmReject(row.id))}
                  onClose={() => removeId(ids.modalConfirmReject(row.id))}>
                  <ConfirmBox
                    isLoading={isLoading}
                    variant="error"
                    textSubmit="Confirm"
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
                <Icon icon="mdi:tick" />
                <Modal
                  open={activeIds.includes(ids.modalConfirmApprove(row.id))}
                  onClose={() => removeId(ids.modalConfirmApprove(row.id))}>
                  <ConfirmBox
                    isLoading={isLoading}
                    variant="success"
                    textSubmit="Confirm"
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
            disabled={queryLoading && !recipes}
            placeholder="Search Recipe"
            onChange={handleSearchRecipe}
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
                disabled={queryLoading && !recipes}
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
                  width: { xs: "100%", md: 120 },
                },
              }}
              value={filter.difficulty || ""}
              onChange={(event) =>
                updateFilter({
                  index: 1,
                  difficulty: event.target.value as Difficulty,
                })
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
              isLoading={queryLoading && !recipes}
            />
            <Button
              sx={{
                height: 40,
                width: { xs: "100%", md: "max-content" },
                textWrap: "nowrap",
              }}
              disabled={queryLoading && !recipes}
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
        <Table>
          <TableHead
            isLoading={queryLoading && !recipes}
            headColumns={HEAD_COLUMNS}
            filter={filter}
            setFilter={setFilter}
          />
          <TableBody
            isLoading={queryLoading && !recipes}
            data={recipes}
            filter={filter}
            bodyCells={BODY_CELLS}
          />
        </Table>
      </TableContainer>
      <Pagination
        dataLength={recipes?.length}
        isLoading={queryLoading && !recipes}
        paginateCount={filter.total || 0}
        paginatePage={filter.index || 0}
        onChange={(_event: ChangeEvent<unknown>, value: number) => {
          updateFilter({ index: value });
        }}
      />
    </Fragment>
  );
};
export default RecipePendingList;
