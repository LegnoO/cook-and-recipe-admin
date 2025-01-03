// ** Library Imports
import { useNavigate } from "react-router-dom";

// ** Mui Components
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";

// ** Config
import { homeRoute } from "@/config/url";

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const NotFoundScreen = () => {
  const navigate = useNavigate();

  function handleBackRouter() {
    navigate(homeRoute);
  }

  return (
    <Box className="content-center">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          height: "100dvh",
        }}>
        <BoxWrapper>
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            You are not authorized!
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            You do not have permission to view this page using the credentials
            that you have provided while login.
          </Typography>
          <Typography sx={{ mb: 3, color: "text.secondary" }}>
            Please contact your site administrator.
          </Typography>
          <Button onClick={handleBackRouter} variant="contained">
            Go to home
          </Button>
        </BoxWrapper>
      </Box>
    </Box>
  );
};

export default NotFoundScreen;
