// * Mui Imports
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

// ** Components
import Logo from "@/components/ui/Logo";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        zIndex: 2000,
      }}
      className="loading">
      <Logo />
      <CircularProgress disableShrink sx={{ mt: "2rem" }} />
    </Box>
  );
};

export default LoadingScreen;
