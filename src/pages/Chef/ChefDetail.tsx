// ** React Imports
import { useEffect } from "react";

// ** Mui Imports
import { Grid, Typography, Button, Stack, Avatar, Box } from "@mui/material";

// ** Components
import { RenderIf } from "@/components";
import { BouncingDotsLoader, Form, TextField } from "@/components/ui";

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
          }}
          direction={"column"}>
          <Typography
            fontWeight={500}
            component="h3"
            sx={{ mb: "2.75rem" }}
            variant="h4">
            Chef Detail Information
          </Typography>
          <RenderIf
            condition={Boolean(chefData)}
            fallback={
              <Box sx={{ justifyContent: "center", display: "flex" }}>
                <BouncingDotsLoader />
              </Box>
            }>
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
                  <TextField
                    label="Level"
                    value={chefData?.level}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Status"
                    value={chefData?.status}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Started Date"
                    value={formatDateTime(chefData?.startedDate!)}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Approval By"
                    value={chefData?.approvalBy.fullName}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Approval Date"
                    value={formatDateTime(chefData?.approvalDate!)}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                {/* <Grid item md={6} xs={12}>
                  <ChipStatus
                    label={chefData?.status}
                    variant={
                      statusColorMap[chefData?.status]?.variant as ColorVariant
                    }
                  />
                </Grid> */}
              </Grid>
            </Box>
          </RenderIf>
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
