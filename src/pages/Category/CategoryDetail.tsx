// ** Mui Imports
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Grid,
  Avatar,
} from "@mui/material";

// ** Components
import { ChipStatus, Icon, ModalLoading } from "@/components/ui";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";

// ** Utils
import { formatDateTime } from "@/utils/helpers";
import { getDetailCategory } from "@/services/categoryService";

// ** Config
import { queryOptions } from "@/config/query-options";
// ** Types
type Props = {
  categoryId: string;
  closeMenu: () => void;
};
const CategoryDetail = ({ closeMenu, categoryId }: Props) => {
  const title = "Category Detail";
  const { isLoading, data: categoryData } = useQuery({
    queryKey: ["category-detail", categoryId],
    queryFn: () => getDetailCategory(categoryId),
    ...queryOptions,
  });

  if (isLoading) {
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
        direction="column"
        sx={{
          gap: 1.5,
          paddingBottom: "2.5rem",
          paddingTop: "1.5rem",
        }}>
        <Grid sx={{ paddingInline: "1.5rem" }} container>
          <Grid item md={3} xs={12}>
            Name:
          </Grid>
          <Grid item md={9} xs={12}>
            {categoryData.name}
          </Grid>
        </Grid>

        <Grid sx={{ paddingInline: "1.5rem" }} container>
          <Grid item md={3} xs={12}>
            Description:
          </Grid>
          <Grid item md={9} xs={12}>
            <Typography sx={{ wordWrap: "break-word" }}>
              {categoryData.description}
            </Typography>
          </Grid>
        </Grid>

        <Grid sx={{ paddingInline: "1.5rem" }} container>
          <Grid item md={3} xs={12}>
            Updated date:
          </Grid>
          <Grid item md={9} xs={12}>
            <Typography
              sx={{
                color: (theme) =>
                  categoryData.updatedDate
                    ? "inherit"
                    : theme.palette.text.disabled,
                fontStyle: categoryData.updatedDate ? "normal" : "italic",
                wordWrap: "break-word",
              }}>
              {categoryData.updatedDate
                ? formatDateTime(categoryData.updatedDate)
                : "Not update yet"}
            </Typography>
          </Grid>
        </Grid>

        <Grid sx={{ paddingInline: "1.5rem" }} container>
          <Grid item md={3} xs={12}>
            Status:
          </Grid>
          <Grid item md={9} xs={12}>
            <ChipStatus
              label={categoryData.status ? "Active" : "Disabled"}
              variant={categoryData.status ? "success" : "disabled"}
            />
          </Grid>
        </Grid>

        <Stack direction="column" spacing={2} sx={{ paddingInline: "1.5rem" }}>
          <Stack direction="column" spacing={1}>
            <Typography fontWeight={500} component="h4" variant="h5">
              Created by
            </Typography>
            <Stack
              sx={{ flex: 1, flexWrap: "wrap" }}
              direction="row"
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Stack direction="row" spacing={1} alignItems={"center"}>
                <Avatar
                  src={categoryData.createdBy?.avatar}
                  alt={`Avatar ${categoryData.createdBy?.fullName}`}
                />
                <Stack direction="column">
                  <Typography fontWeight="500" color="text.primary">
                    {categoryData.createdBy?.fullName}
                  </Typography>
                  <Typography color="text.secondary">
                    {categoryData.createdBy?.email}
                  </Typography>
                </Stack>
              </Stack>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  marginLeft: "0 !important",
                  marginTop: {
                    xs: "0.5rem !important",
                    md: "0 !important",
                  },
                }}
                color="text.secondary">
                Created on {formatDateTime(categoryData.createdDate!)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {categoryData.disabledBy && (
          <Stack
            direction="column"
            spacing={2}
            sx={{ paddingInline: "1.5rem" }}>
            <Stack direction="column" spacing={1}>
              <Typography fontWeight={500} component="h4" variant="h5">
                Disable by
              </Typography>
              <Stack
                sx={{ flex: 1, flexWrap: "wrap" }}
                direction="row"
                justifyContent={"space-between"}
                alignItems={"center"}>
                <Stack direction="row" spacing={1} alignItems={"center"}>
                  <Avatar
                    src={categoryData.disabledBy?.avatar}
                    alt={`Avatar ${categoryData.disabledBy?.fullName}`}
                  />
                  <Stack direction="column">
                    <Typography fontWeight="500" color="text.primary">
                      {categoryData.disabledBy?.fullName}
                    </Typography>
                    <Typography color="text.secondary">
                      {categoryData.disabledBy?.email}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    marginLeft: "0 !important",
                    marginTop: {
                      xs: "0.5rem !important",
                      md: "0 !important",
                    },
                  }}
                  color="text.secondary">
                  Disabled on {formatDateTime(categoryData.disabledDate!)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default CategoryDetail;
