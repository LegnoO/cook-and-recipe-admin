// ** Mui Imports
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Grid,
  Avatar,
  Button,
} from "@mui/material";

// ** Components
import { ChipStatus, Icon, ModalLoading } from "@/components/ui";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";

// ** Utils
import { formatAddress, formatDateTime } from "@/utils/helpers";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { getUserDetail } from "@/services/userService";

// ** Types
type Props = {
  userId: string;
  closeMenu: () => void;
};
const UserDetail = ({ closeMenu, userId }: Props) => {
  const title = "User Detail";
  const { isLoading, data: userData } = useQuery({
    queryKey: ["user-detail", userId],
    queryFn: () => getUserDetail(userId),
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
          xs: "312px",
          sm: "412px",
          md: "520px",
          lg: "612px",
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
        <Box
          sx={{
            "&": {
              mb: 5,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              position: "relative",
            },
          }}>
          <Avatar
            alt={`Avatar ${userData?.fullName ?? "default"}`}
            src={userData?.avatar}
            sx={{ height: 120, width: 120 }}
          />
        </Box>

        <Grid sx={{ paddingInline: "1.5rem" }} container>
          <Grid
            sx={{
              "& div": {
                marginBottom: "0.5rem",
              },
            }}
            item
            md={6}
            xs={12}>
            <Stack sx={{ gap: "0.5rem", flexDirection: "row" }}>
              <Typography>Name:</Typography>
              <Typography>{userData?.fullName}</Typography>
            </Stack>
            <Stack sx={{ gap: "0.5rem", flexDirection: "row" }}>
              <Typography>Email:</Typography>
              <Typography>{userData?.email}</Typography>
            </Stack>
            <Stack sx={{ gap: "0.5rem", flexDirection: "row" }}>
              <Typography>Gender:</Typography>
              <Typography>{userData?.gender}</Typography>
            </Stack>
            {userData?.dateOfBirth && (
              <Stack sx={{ gap: "0.5rem", flexDirection: "row" }}>
                <Typography>dateOfBirth:</Typography>
                <Typography>{formatDateTime(userData.dateOfBirth)}</Typography>
              </Stack>
            )}
            {userData?.address && (
              <Stack sx={{ gap: "0.5rem", flexDirection: "row" }}>
                <Typography>Address:</Typography>
                <Typography>{formatAddress(userData.address, 26)}</Typography>
              </Stack>
            )}
          </Grid>

          <Grid
            sx={{
              "& div": {
                marginBottom: "0.5rem",
              },
            }}
            item
            md={6}
            xs={12}>
            <Stack sx={{ gap: "0.5rem", flexDirection: "row" }}>
              <Typography>CreatedBy:</Typography>
              <Typography>{userData?.createdBy}</Typography>
            </Stack>
            <Stack sx={{ gap: "0.5rem", flexDirection: "row" }}>
              <Typography>Phone:</Typography>
              <Typography>{userData?.phone}</Typography>
            </Stack>
            <Stack sx={{ gap: "0.5rem", flexDirection: "row" }}>
              <Typography>Status:</Typography>
              <ChipStatus
                label={userData?.status ? "Active" : "Disabled"}
                variant={userData?.status ? "success" : "disabled"}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      <Stack
        direction="row"
        justifyContent="end"
        sx={{ paddingInline: "1.5rem", pb: "1.5rem" }}>
        <Button
          onClick={closeMenu}
          sx={{ width: { xs: "100%", md: "auto" } }}
          color="secondary"
          variant="contained">
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default UserDetail;
