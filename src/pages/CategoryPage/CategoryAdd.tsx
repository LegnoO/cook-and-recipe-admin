// ** React Imports
import { useState, Dispatch, SetStateAction } from "react";

// ** Mui Imports
import { Typography, Button, Stack, Input } from "@mui/material";

// ** Library Imports
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";

// ** Components
import { Form, TextField } from "@/components/ui";
import { UploadImage } from "@/components";

// ** Services
import { createCategory } from "@/services/categoryService";

// ** Utils
import { createFormData } from "@/utils/helpers";

// ** Schemas
import {
  AddCategoryValues,
  addCategorySchema,
} from "@/schemas/addCategorySchema";

// ** Types
type Props = {
  closeMenu: () => void;
  setController: Dispatch<SetStateAction<AbortController | null>>;
  refetch: () => void;
};

const CategoryAdd = ({ setController, closeMenu, refetch }: Props) => {
  const title = "Create Category";
  const form = useForm<AddCategoryValues>({
    resolver: zodResolver(addCategorySchema),
  });

  const [isLoading, setLoading] = useState(false);
  const image = form.watch("image");
  const formErrors = form.formState.errors;

  async function handleFileSelect(file?: File, _imageDataUrl?: string) {
    if (file) form.setValue("image", file);
  }

  async function onSubmit(dataSubmit: AddCategoryValues) {
    const toastLoading = toast.loading("Loading...");

    try {
      setLoading(true);
      const newController = new AbortController();
      setController(newController);
      const formData = createFormData(dataSubmit);
      await createCategory(formData, newController);
      toast.success("Created group successfully");
      refetch();
      setLoading(false);
      setController(null);
      closeMenu();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      toast.dismiss(toastLoading);
    }
  }

  return (
    <PerfectScrollbar options={{ wheelPropagation: false }}>
      <Form
        sx={{ maxHeight: "95dvh" }}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}>
        <Stack
          sx={{
            borderRadius: "inherit",
            backgroundColor: (theme) => theme.palette.background.paper,
            height: "auto",
            padding: "1.5rem",
          }}
          direction={"column"}
          alignItems={"center"}>
          <Stack
            sx={{ width: "100%", mb: "2.5rem" }}
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}>
            <Typography fontWeight={500} component="h3" variant="h4">
              {title}
            </Typography>
          </Stack>

          <Stack sx={{ gap: 2 }} direction="column">
            <Controller
              name="name"
              control={form.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  required
                  id="Category Name"
                  fullWidth
                  label="Category Name"
                  placeholder="Enter category name"
                  disabled={isLoading}
                  variant="outlined"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  required
                  id="description"
                  fullWidth
                  label="Description"
                  placeholder={"Enter category description"}
                  disabled={isLoading}
                  variant="outlined"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />

            <Stack direction="column">
              <Typography
                sx={{
                  mb: 0.25,
                  fontSize: "13px",
                  color: (theme) => theme.palette.text.primary,
                }}
                variant="h6">
                Upload avatar
              </Typography>

              <Stack
                sx={{
                  borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
                direction="row"
                alignItems="center"
                spacing={0}>
                <UploadImage
                  name="image"
                  disabled={isLoading}
                  sx={{
                    borderRadius: "inherit 0 0 inherit",
                    minWidth: 125,
                    maxWidth: 220,
                    fontWeight: 500,
                  }}
                  onFileSelect={handleFileSelect}>
                  Choose File
                </UploadImage>
                <Input
                  disableUnderline
                  sx={{
                    paddingBlock: 0,
                    paddingInline: "0.5rem",
                    backgroundColor: "transparent",
                    border: "1px solid transparent",
                    outline: "none",
                  }}
                  value={image ? image.name : "No file chosen"}
                />
              </Stack>

              {formErrors.image && (
                <Typography
                  sx={{ mt: "0.25rem" }}
                  color="error"
                  variant="subtitle2">
                  Required
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            justifyContent="end"
            sx={{
              marginTop: "auto",
              paddingTop: "1.5rem",
              justifyContent: "end",
              width: "100%",
              gap: "0.75rem",
            }}>
            <Button
              type="button"
              onClick={closeMenu}
              color="secondary"
              variant="contained">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} variant="contained">
              Submit
            </Button>
          </Stack>
        </Stack>
      </Form>
    </PerfectScrollbar>
  );
};
export default CategoryAdd;
