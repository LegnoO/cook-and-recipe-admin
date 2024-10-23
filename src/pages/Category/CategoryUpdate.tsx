// ** React Imports
import { useState, useEffect } from "react";

// ** Mui Imports
import {
  Stack,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  Button,
} from "@mui/material";

// ** Components
import {
  ModalLoading,
  ChipStatus,
  Icon,
  Image,
  TextField,
} from "@/components/ui";
import { RenderIf } from "@/components";

// ** Library Imports
import PerfectScrollbar from "react-perfect-scrollbar";
import { useQuery } from "@tanstack/react-query";
import { formatDateTime, hexToRGBA } from "@/utils/helpers";

// ** Services
import { getDetailCategory } from "@/services/categoryService";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Types
type Props = {
  categoryId: string;
  closeMenu: () => void;
};

const CategoryUpdate = ({ categoryId, closeMenu }: Props) => {
  const title = "Category Update";
  const { data: categoryData } = useQuery({
    queryKey: ["category-detail", categoryId],
    queryFn: () => getDetailCategory(categoryId),
    ...queryOptions,
  });

  const [category, setCategory] = useState<CategoryDetail>();

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData);
    }
  }, [categoryData]);

  if (!category) {
    return <ModalLoading title={title} closeMenu={closeMenu} />;
  }

  return (
    <Box
      sx={{
        overflow: "hidden",
        width: {
          xs: "90%",
          sm: "420px",
          md: "500px",
        },
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
          sx={{ textAlign: "center" }}
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

      <Stack direction="column" spacing={2}>
        <TextField fullWidth label="Category Name" />
        <TextField
          fullWidth
          label="Category Description"
          multiline
          placeholder="test"
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent="end"
        spacing={1.5}
        sx={{ mt: "1rem", pt: "1.5rem" }}>
        <Button
          onClick={closeMenu}
          sx={{ width: { xs: "100%", md: "auto" } }}
          color="secondary"
          variant="contained">
          Cancel
        </Button>
        <Button
          type="submit"
          sx={{
            width: { xs: "100%", md: "auto" },
          }}
          variant="contained">
          Update
        </Button>
      </Stack>
    </Box>
  );
};

export default CategoryUpdate;
