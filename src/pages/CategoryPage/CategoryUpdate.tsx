// ** React Imports
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";

// ** Mui Imports
import {
  Stack,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";

// ** Components
import { ModalLoading, Icon, TextField } from "@/components/ui";
import { UploadImage } from "@/components";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// ** Services
import { getCategoryDetail, updateCategory } from "@/services/categoryService";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";
import {
  createFormData,
  handleToastMessages,
  hexToRGBA,
} from "@/utils/helpers";

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
  const [image, setImage] = useState<{
    file: File | null;
    url: string;
  }>({ file: null, url: "" });
  const [isLoading, setLoading] = useState(false);
  const [category, setCategory] = useState<Partial<CategoryUpdate>>();

  function handleChangeCategory(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | File,
    field: keyof CategoryUpdate,
  ) {
    if (field === "image") {
      if (event instanceof File) {
        setCategory((prev) => ({ ...prev, [field]: event }));
      }
    } else {
      if (!(event instanceof File)) {
        const value = event.target.value;
        if (value) setCategory((prev) => ({ ...prev, [field]: value }));
      }
    }
  }

  async function handleSubmit() {
    const toastLoading = toast.loading("Loading...");

    try {
      setLoading(true);
      const newController = new AbortController();
      setController(newController);
      if (category) {
        const formData = createFormData(category);
        await updateCategory(categoryId, formData, newController);
        toast.success("Updated successfully");
        refetch();
        closeMenu();
      }

      setController(null);
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }

  function handleFileSelect(file: File, imageDataUrl: string) {
    const newFileUpdated = { file, url: imageDataUrl };
    if (newFileUpdated) {
      setImage(newFileUpdated);
      handleChangeCategory(newFileUpdated.file, "image");
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
        <Box
          className="upload-category-image"
          sx={{
            "&": {
              alignSelf: "center",
              height: 125,
              width: 125,
              mb: 3,
              cursor: "pointer",
              position: "relative",
            },
          }}>
          <Avatar
            alt={categoryData?.name || "no data"}
            src={image.url ? image.url : categoryData?.imageUrl}
            sx={{ height: "100%", width: "100%" }}
          />
          <UploadImage
            type="react-node"
            name="avatar"
            onFileSelect={handleFileSelect}>
            <Stack
              direction="column"
              justifyContent={"center"}
              alignItems="center"
              spacing={1}
              className="upload-category-placeholder"
              sx={{
                "&": {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transition: "opacity 300ms",
                  opacity: 0,
                  borderRadius: "50%",
                  height: "100%",
                  width: "100%",
                  willChange: "opacity",
                  backgroundColor: (theme) =>
                    hexToRGBA(theme.palette.customColors.backdrop, 0.5),
                  color: (theme) =>
                    theme.palette.customColors.backdropContrastText,
                },
                "&:hover": { opacity: 1 },
              }}>
              <Icon fontSize="1.35rem" icon={"ic:sharp-add-a-photo"} />
              <Typography
                sx={{ lineHeight: 1, color: "inherit" }}
                variant="body2">
                Update image
              </Typography>
            </Stack>
          </UploadImage>
        </Box>
        <Stack spacing={1} direction="row" alignItems={"center"}>
          <TextField
            onChange={(event) => handleChangeCategory(event, "name")}
            value={category?.name || ""}
            fullWidth
            label="Name"
          />
        </Stack>
        <Stack spacing={1} direction="row" alignItems={"center"}>
          <TextField
            onChange={(event) => handleChangeCategory(event, "description")}
            value={category?.description || ""}
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
