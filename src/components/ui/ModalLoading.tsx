// ** Mui Imports
import { Stack, Box, IconButton, Typography } from "@mui/material";

// ** Components
import { Icon, Spinner } from "@/components/ui";

// ** Types
type Props = { title: string; closeMenu: () => void };

const ModalLoading = ({ title, closeMenu }: Props) => {
  return (
    <Box
      sx={{
        position: "relative",
        background: (theme) => theme.palette.background.paper,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        padding: "1.5rem",
        width: "90dvw",
        maxWidth: {
          sm: "425px",
        },
        height: {
          xs: "200px",
          sm: "300px",
        },
      }}>
      <Typography
        sx={{
          fontSize: "1.125rem",
          fontWeight: 600,
          p: 0,
          textAlign: { xs: "center", sm: "left" },
        }}
        component="h2">
        {title}
      </Typography>
      <Stack
        sx={{ height: "100%" }}
        alignItems="center"
        justifyContent="center">
        <Stack direction="column" alignItems="center" spacing={2}>
          <Box sx={{ height: 32, aspectRatio: 1 }}>
            <Spinner />
          </Box>
          <Typography
            sx={{
              fontSize: "1rem",
              textAlign: "center",
            }}>
            Loading data...
          </Typography>
        </Stack>
      </Stack>
      <IconButton
        disableRipple
        onClick={closeMenu}
        sx={{
          position: "absolute",
          right: "1rem",
          top: "1rem",
        }}>
        <Icon fontSize="1.5rem" icon="si:close-line" />
      </IconButton>
    </Box>
  );
};

export default ModalLoading;
