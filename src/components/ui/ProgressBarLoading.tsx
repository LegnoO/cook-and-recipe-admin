// ** Mui Imports
import { Box, keyframes } from "@mui/material";

// ** Types
type Props = { isLoading: boolean };
const ProgressBarLoading = ({ isLoading }: Props) => {
  const backgroundAnimation = keyframes`
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
`;

  return (
    <Box
      sx={{
        inset: 0,
        height: 3,
        width: "100%",
        position: "absolute",
        borderRadius: "0.5rem",
        backgroundSize: "600%",
        transition: "transform 0.3s ease-in-out",
        transformOrigin: isLoading ? "left" : "right",
        transform: isLoading ? "scaleX(1)" : "scaleX(0)",
        animation: `${backgroundAnimation} 12s linear infinite`,
        backgroundColor: (theme) => theme.palette.primary.main,
        // background:
        //   "linear-gradient(-45deg, #ffa63d, #ff3d77, #338aff, #3cf0c5)",
      }}
    />
  );
};

export default ProgressBarLoading;
