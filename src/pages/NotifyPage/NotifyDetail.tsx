// ** Mui Imports
import { Box, Typography, IconButton, Stack, Avatar } from "@mui/material";

// ** Components
import { ChipStatus, Icon, ModalLoading } from "@/components/ui";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Utils
import { formatDateTime } from "@/utils/helpers";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { getNotifyDetail } from "@/services/notifyService";

// ** Types
type Props = {
  notifyId: string;
  closeMenu: () => void;
};

const NotifyDetail = ({ closeMenu, notifyId }: Props) => {
  const title = "Notify Detail";
  const { isLoading, data: notification } = useQuery({
    queryKey: ["notify-detail", notifyId],
    queryFn: () => getNotifyDetail(notifyId),
    ...queryOptions,
  });

  if (isLoading) {
    return <ModalLoading title={title} closeMenu={closeMenu} />;
  }

  const statusMap = {
    read: "disabled",
    unread: "info",
    sent: "success",
  };

  return (
    <Box
      sx={{
        overflow: "hidden",
        width: "100%",
        maxHeight: "95dvh",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        padding: "1.5rem",
      }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
        }}>
        <Typography
          sx={{ textAlign: { xs: "center", sm: "left" } }}
          fontWeight={500}
          component="h2"
          variant="h4">
          Notification Details
        </Typography>
        <IconButton
          disableRipple
          onClick={closeMenu}
          sx={{
            position: "absolute",
            padding: 0,
            right: 0,
            top: 0,
          }}>
          <Icon fontSize="1.5rem" icon="si:close-line" />
        </IconButton>
      </Box>

      <Stack
        direction="column"
        sx={{
          paddingTop: "1rem",
          gap: "0.5rem",
        }}>
        <Typography sx={{ fontSize: "1.125rem" }}>
          {notification?.title}
        </Typography>
        <Typography sx={{ fontSize: "1rem" }}>
          {formatDateTime(notification!.createdDate)}
        </Typography>

        <Stack
          sx={{ flexDirection: "row", marginTop: "0.75rem", gap: "0.75rem" }}>
          <Avatar
            sx={{ height: "40px", width: "40px", objectFit: "cover" }}
            src={notification?.createdBy.avatar}
            alt={notification?.createdBy.fullName}
          />
          <Stack sx={{ flexDirection: "column" }}>
            <Typography sx={{ fontSize: "0.875rem" }}>
              {notification?.createdBy.fullName}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              {notification?.createdBy.group.name}
            </Typography>
          </Stack>
        </Stack>

        <Stack sx={{ marginTop: "1rem", flexDirection: "column" }}>
          <Typography
            sx={{
              fontWeight: 500,
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
            }}>
            Message:
          </Typography>
          <Typography sx={{ fontSize: "0.75rem" }}>
            {notification?.message}
          </Typography>
        </Stack>

        <Box sx={{ marginTop: "1.5rem" }}>
          <Typography
            sx={{
              fontWeight: 500,
              marginBottom: "1rem",
              fontSize: "0.875rem",
            }}>
            Recipients:
          </Typography>
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            <Stack sx={{ gap: "1rem", height: 200 }}>
              {notification?.toUsers?.map((userData, index) => (
                <Stack
                  key={index}
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Stack
                    sx={{
                      flexDirection: "row",
                      gap: "0.75rem",
                    }}>
                    <Avatar
                      sx={{ height: "40px", width: "40px", objectFit: "cover" }}
                      src={userData.user.avatar}
                      alt={userData.user.fullName}
                    />
                    <Stack sx={{ flexDirection: "column" }}>
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {userData.user.fullName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem" }}>
                        {userData.user.email}
                      </Typography>
                    </Stack>
                  </Stack>

                  <ChipStatus
                    variant={statusMap[userData.status] as ColorVariant}
                    label={userData.status}
                  />
                </Stack>
              ))}
            </Stack>
          </PerfectScrollbar>
        </Box>
      </Stack>
    </Box>
  );
};

export default NotifyDetail;
