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
  Image,
} from "@/components/ui";
import { TableHead, TableBody, Pagination } from "@/components";
import { SearchInput } from "@/components/fields";
import ProgressBarLoading from "@/components/ui/ProgressBarLoading";
import RecipeDetail from "./RecipeDetail";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

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
import {
  queryRecipe,
  revokeApprovalRecipe,
  privateRecipe,
} from "@/services/recipeService";
import { useSearchParams } from "react-router-dom";

const RecipeList = () => {
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
  const [filter, setFilter] = useState<Filter<RecipeFilter>>({
    index: Number(searchParams.get("index")) || defaultFilter.index,
    size: Number(searchParams.get("size")) || defaultFilter.size,
    difficulty: (searchParams.get("difficulty") as Difficulty) || undefined,
    status: searchParams.get("status") || undefined,
    verifyStatus:
      (searchParams.get("verifyStatus") as VerifyStatus) || undefined,
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
    queryKey: ["list-recipe", searchParams.toString()],
    queryFn: () => queryRecipe(searchParams.toString()),
    ...queryOptions,
  });

  const [isLoading, setLoading] = useState(false);

  function updateFilter(updates: Partial<Filter<RecipeFilter>>) {
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
    { title: "Approve Date", sortName: "approvedDate" },
    { title: "Approve By", sortName: "approvedBy" },
    { title: "Verify Status", sortName: "verifyStatus" },
    { title: "Share Status", sortName: "status" },
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
      render: (row: Recipe) => formatDateTime(row.createdDate),
    },
    {
      render: (row: Recipe) => row.approvalBy.fullName,
    },
    {
      render: (row: Recipe) => (
        <ChipStatus
          sx={{ textTransform: "capitalize" }}
          label={row.verifyStatus}
          variant={row.verifyStatus === "rejected" ? "error" : "success"}
        />
      ),
    },
    {
      render: (row: Recipe) => (
        <ChipStatus
          label={row.status ? "Public" : "Private"}
          variant={row.status ? "success" : "disabled"}
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
                  variant="success"
                  textSubmit={"Confirm"}
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
                  variant={"error"}
                  textSubmit="Confirm"
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
            <Select
              value={filter.verifyStatus || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateFilter({
                  index: 1,
                  verifyStatus: event.target.value as VerifyStatus,
                })
              }
              menuItems={[
                { value: "verified", label: "Verified" },
                { value: "rejected", label: "Rejected" },
              ]}
              defaultOption={"Select Verify Status"}
              fullWidth
              isLoading={queryLoading && !recipes}
            />
            <Select
              value={filter.status || ""}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateFilter({
                  index: 1,
                  status: event.target.value,
                })
              }
              menuItems={[
                { value: "true", label: "Public" },
                { value: "false", label: "Private" },
              ]}
              defaultOption="Select Share Status"
              fullWidth
              isLoading={queryLoading && !recipes}
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

            <Button
              sx={{
                height: 40,
                width: { xs: "100%", md: "max-content" },
                textWrap: "nowrap",
              }}
              disabled={queryLoading && !recipes}
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
        <ProgressBarLoading isLoading={queryLoading} />
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
export default RecipeList;
