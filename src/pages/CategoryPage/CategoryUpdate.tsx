// ** React Imports
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";

// ** Mui Imports
import { Stack, Typography, Box, IconButton, Button } from "@mui/material";

// ** Components
import { ModalLoading, Icon, TextField } from "@/components/ui";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// ** Services
import { getCategoryDetail, updateCategory } from "@/services/categoryService";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";
import { handleToastMessages } from "@/utils/helpers";

// ** Types
type Props = {
  categoryId: string;
  closeMenu: () => void;
  refetch: () => void;
  setController: Dispatch<SetStateAction<AbortController | null>>;
};

const CategoryUpdate = ({
  categoryId,
  closeMenu,
  refetch,
  setController,
}: Props) => {
  const title = "Category Update";
  const { data: categoryData } = useQuery({
    queryKey: ["category-detail", categoryId],
    queryFn: () => getCategoryDetail(categoryId),
    ...queryOptions,
  });

  const [isLoading, setLoading] = useState(false);
  const [category, setCategory] = useState<Partial<CategoryUpdate>>();

  function handleChangeCategory(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof CategoryUpdate,
  ) {
    const value = event.target.value;
    if (value) setCategory((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const toastLoading = toast.loading("Loading...");

    try {
      setLoading(true);
      const newController = new AbortController();
      setController(newController);

      await updateCategory(
        categoryId,
        category as CategoryUpdate,
        newController,
      );

      toast.success("Updated successfully");
      refetch();
      closeMenu();

      setController(null);
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }

  useEffect(() => {
    if (categoryData) {
      setCategory({
        name: categoryData.name,
        description: categoryData.description,
      });
    }
  }, [categoryData]);

  if (!categoryData) {
    return <ModalLoading title={title} closeMenu={closeMenu} />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "95dvh",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
      }}>
      <Box
        sx={{
          position: "relative",
          paddingBlock: "1rem",
          paddingInline: "1.5rem",
        }}>
        <Typography
          sx={{ textAlign: { xs: "center", sm: "left" } }}
          fontWeight={500}
          component="h2"
          variant="h4">
          {title}
        </Typography>
        <IconButton
          disableRipple
          onClick={closeMenu}
          sx={{
            position: "absolute",
            right: "0.5rem",
            top: "20%",
          }}>
          <Icon fontSize="1.5rem" icon="si:close-line" />
        </IconButton>
      </Box>

      <Stack
        sx={{
          paddingTop: "1rem",
          paddingInline: "1.5rem",
        }}
        direction="column"
        spacing={2}>
        <Stack spacing={1} direction="row" alignItems={"center"}>
          <TextField
            onChange={(event) => handleChangeCategory(event, "name")}
            value={category?.name}
            fullWidth
            label="Name"
          />
        </Stack>
        <Stack spacing={1} direction="row" alignItems={"center"}>
          <TextField
            onChange={(event) => handleChangeCategory(event, "description")}
            value={category?.description}
            fullWidth
            multiline
            placeholder="test"
            label="Description"
          />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent="end"
        sx={{
          justifyContent: "end",
          width: "100%",
          gap: "0.75rem",
          padding: "1.5rem",
        }}>
        <Button onClick={closeMenu} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleSubmit}
          type="submit"
          variant="contained">
          Update
        </Button>
      </Stack>
    </Box>
  );
};

export default CategoryUpdate;
