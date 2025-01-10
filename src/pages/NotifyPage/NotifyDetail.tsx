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
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Utils
import { formatAddress, formatDateTime } from "@/utils/helpers";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { getUserDetail } from "@/services/userService";

// ** Types
type Props = {
  notifyId: string;
  closeMenu: () => void;
};
const NotifyDetail = ({ closeMenu, notifyId }: Props) => {
  const title = "Notify Detail";
  const { isLoading, data: userData } = useQuery({
    queryKey: ["notify-detail", notifyId],
    queryFn: () => getUserDetail(notifyId),
    ...queryOptions,
  });

  if (isLoading) {
    return <ModalLoading title={title} closeMenu={closeMenu} />;
  }

  return (
    <Box
      sx={{
        overflow: "hidden",
        width: "100%",
        maxWidth: {
          sm: "500px",
        },
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
            right: "0.5rem",
            top: "20%",
          }}>
          <Icon fontSize="1.5rem" icon="si:close-line" />
        </IconButton>
      </Box>

      <Stack
        direction="column"
        sx={{
          paddingBottom: "2.5rem",
          paddingTop: "1rem",
        }}>
        <Typography sx={{ fontSize: "1.125rem" }}>
          notification.title
        </Typography>
        <Typography sx={{ fontSize: "1.125rem" }}>
          notification.createdDate
        </Typography>

        <Stack sx={{ marginTop: "1rem", gap: "0.75rem" }}>
          <Avatar
            sx={{ height: "40px", width: "40px", objectFit: "cover" }}
            src="https://res.cloudinary.com/dzl5ur69n/image/upload/v1729153401/hycm0az7rxrmg07swprs.jpg"
            alt=""
          />
          <Stack sx={{ flexDirection: "column" }}>
            <Typography sx={{ fontSize: "0.875rem" }}>
              notification.fullName
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              notification.name
            </Typography>
          </Stack>
        </Stack>

        <Stack sx={{ marginTop: "1rem", gap: "0.75rem" }}>
          <Avatar
            sx={{ height: "40px", width: "40px", objectFit: "cover" }}
            src="https://res.cloudinary.com/dzl5ur69n/image/upload/v1729153401/hycm0az7rxrmg07swprs.jpg"
            alt=""
          />
          <Stack sx={{ flexDirection: "column" }}>
            <Typography
              sx={{
                fontWeight: 500,
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
              }}>
              Message:
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              notification.message
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ marginTop: "1.5rem" }}>
          <Typography
            sx={{
              fontWeight: 500,
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
            }}>
            Recipients:
          </Typography>
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            <Stack sx={{ gap: "0.5rem", height: 200 }}>
              <Stack
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Stack sx={{ marginTop: "1rem", gap: "0.75rem" }}>
                  <Avatar
                    sx={{ height: "40px", width: "40px", objectFit: "cover" }}
                    src="https://res.cloudinary.com/dzl5ur69n/image/upload/v1729153401/hycm0az7rxrmg07swprs.jpg"
                    alt=""
                  />
                  <Stack sx={{ flexDirection: "column" }}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        marginBottom: "0.5rem",
                        fontSize: "0.875rem",
                      }}>
                      Message:
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem" }}>
                      notification.message
                    </Typography>
                  </Stack>
                </Stack>
                <Typography sx={{ fontSize: "0.75rem" }}>read</Typography>
              </Stack>
            </Stack>
          </PerfectScrollbar>
        </Box>
      </Stack>
    </Box>
  );
};

export default NotifyDetail;
