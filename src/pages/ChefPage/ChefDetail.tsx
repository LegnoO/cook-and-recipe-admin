// ** React Imports
import { useEffect } from "react";

// ** Mui Imports
import {
  Grid,
  Typography,
  Stack,
  Avatar,
  Box,
  FormLabel,
  IconButton,
} from "@mui/material";

// ** Components
import {
  BouncingDotsLoader,
  ChipStatus,
  Form,
  Icon,
  ModalLoading,
} from "@/components/ui";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { getChefDetail } from "@/services/chefService";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Utils
import { formatDateTime } from "@/utils/helpers";

type Props = {
  chefId: string;
  closeMenu: () => void;
};

const ChefDetail = ({ chefId, closeMenu }: Props) => {
  const title = "Chef Detail";
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

  if (!chefData) {
    return <ModalLoading title={title} closeMenu={closeMenu} />;
  }

  return (
    <PerfectScrollbar
      options={{ useBothWheelAxes: true, wheelPropagation: false }}>
      <Form
        sx={{
          width: "100%",
          maxWidth: {
            sm: "500px",
          },
          maxHeight: "95dvh",
        }}
        noValidate>
        <Stack
          sx={{
            borderRadius: "inherit",
            backgroundColor: (theme) => theme.palette.background.paper,
            height: "auto",
            maxWidth: "30rem",
          }}
          direction={"column"}>
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

          <Box>
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
            <Grid
              sx={{ paddingInline: "1.5rem", paddingBottom: "1.5rem" }}
              container
              rowSpacing={3}
              columnSpacing={3}>
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
        </Stack>
      </Form>
    </PerfectScrollbar>
  );
};
export default ChefDetail;
