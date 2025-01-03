// ** React Imports
import { useEffect } from "react";

// ** Mui Imports
import {
  Grid,
  Typography,
  Button,
  Stack,
  Avatar,
  Box,
  FormLabel,
} from "@mui/material";

// ** Components
import { BouncingDotsLoader, ChipStatus, Form } from "@/components/ui";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { getChefDetail } from "@/services/chefService";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDateTime } from "@/utils/helpers";

// ** Utils

type Props = {
  chefId: string;
  closeMenu: () => void;
};

const ChefDetail = ({ chefId, closeMenu }: Props) => {
  const statusColorMap = {
    active: { variant: "active" },
    pending: { variant: "warning" },
    disabled: { variant: "disabled" },
    rejected: { variant: "error" },
    banned: { variant: "banned" },
  };

  const { data: chefData } = useQuery({
    queryKey: ["chef-detail", chefId],
    queryFn: () => getChefDetail(chefId),
    ...queryOptions,
  });

  useEffect(() => {}, [chefData]);

  return (
    <PerfectScrollbar
      options={{ useBothWheelAxes: true, wheelPropagation: false }}>
      <Form sx={{ maxHeight: "95dvh" }} noValidate>
        <Stack
          sx={{
            borderRadius: "inherit",
            backgroundColor: (theme) => theme.palette.background.paper,
            height: "auto",
            padding: "1.5rem",
            maxWidth: "30rem",
          }}
          direction={"column"}>
          <Typography
            fontWeight={500}
            component="h3"
            sx={{ mb: "2.75rem" }}
            variant="h4">
            Chef Detail Information
          </Typography>

          {chefData ? (
            <Box className="modal-loading-info">
              <Stack sx={{ mb: 5 }} direction="column" alignItems="center">
                <Box
                  className="upload-avatar"
                  sx={{
                    "&": {
                      height: 100,
                      width: 100,
                      mb: 1.5,
                    },
                  }}>
                  <Avatar
                    alt={`Avatar ${chefData?.userInfo.fullName ?? "default"}`}
                    src={chefData?.userInfo.avatar}
                    sx={{ height: "100%", width: "100%" }}
                  />
                </Box>
                <Typography sx={{ fontSize: "1.25rem" }} color="text.primary">
                  {chefData?.userInfo.fullName}
                </Typography>
                <Typography sx={{ fontSize: "1rem" }} color="text.secondary">
                  {chefData?.userInfo.email}
                </Typography>
              </Stack>
              <Grid container rowSpacing={3} columnSpacing={3}>
                <Grid item md={6} xs={12}>
                  <Stack direction="column" sx={{ gap: 1 }}>
                    <FormLabel
                      sx={{
                        fontSize: "13px",
                        color: "rgba(225, 222, 245, 0.9)",
                      }}>
                      Level
                    </FormLabel>
                    <Typography sx={{ fontSize: "15px" }} variant="subtitle1">
                      {chefData.level}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Stack direction="column" sx={{ gap: 1 }}>
                    <FormLabel
                      sx={{
                        fontSize: "13px",
                        color: "rgba(225, 222, 245, 0.9)",
                      }}>
                      Status
                    </FormLabel>
                    <ChipStatus
                      variant={
                        statusColorMap[chefData.status]?.variant as ColorVariant
                      }
                      label={chefData?.status}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="column" sx={{ gap: 1 }}>
                    <FormLabel
                      sx={{
                        fontSize: "13px",
                        color: "rgba(225, 222, 245, 0.9)",
                      }}>
                      Started Date
                    </FormLabel>
                    <Typography sx={{ fontSize: "15px" }} variant="subtitle1">
                      {formatDateTime(chefData?.startedDate!)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="column" sx={{ gap: 1 }}>
                    <FormLabel
                      sx={{
                        fontSize: "13px",
                        color: "rgba(225, 222, 245, 0.9)",
                      }}>
                      Started Date
                    </FormLabel>
                    <Typography sx={{ fontSize: "15px" }} variant="subtitle1">
                      {chefData.approvalBy.fullName}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="column" sx={{ gap: 1 }}>
                    <FormLabel
                      sx={{
                        fontSize: "13px",
                        color: "rgba(225, 222, 245, 0.9)",
                      }}>
                      Approval Date
                    </FormLabel>
                    <Typography sx={{ fontSize: "15px" }} variant="subtitle1">
                      {formatDateTime(chefData?.approvalDate!)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="column" sx={{ gap: 1 }}>
                    <FormLabel
                      sx={{
                        fontSize: "13px",
                        color: "rgba(225, 222, 245, 0.9)",
                      }}>
                      Description
                    </FormLabel>
                    <Typography sx={{ fontSize: "15px" }} variant="subtitle1">
                      {chefData.description}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ justifyContent: "center", display: "flex" }}>
              <BouncingDotsLoader />
            </Box>
          )}
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
          </Stack>
        </Stack>
      </Form>
    </PerfectScrollbar>
  );
};
export default ChefDetail;
