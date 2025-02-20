// ** Library Imports
import { Link } from "react-router-dom";

// ** Mui Components
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const ErrorPage = () => {
  return (
    <Box className="content-center">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          height: "100%",
        }}>
        <BoxWrapper>
          <Typography variant="h2" sx={{ mb: 1 }}>
            Something went wrong!
          </Typography>
          <Typography sx={{ mb: 1.5, color: "text.secondary" }}>
            The server encountered an internal error and was unable to complete
            your request.
          </Typography>
          <Link to="/">
            <Button variant="contained">Go home</Button>
          </Link>
        </BoxWrapper>
      </Box>
    </Box>
  );
};

export default ErrorPage;
