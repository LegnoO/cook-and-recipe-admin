// ** Mui Imports
import { keyframes, Box } from "@mui/material";

const loading = keyframes`to {transform: rotate(1turn)}`;

const Spinner = () => {
  return (
    <Box
      sx={{
        "&": {
          content: '""',
          height: "100%",
          padding: "4px",
          aspectRatio: 1,
          borderRadius: "50%",
          background: (theme) => theme.palette.primary.main,
          "--_m":
            "conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box",
          mask: "var(--_m)",
          WebkitMask: "var(--_m)",
          maskComposite: "subtract",
          WebkitMaskComposite: "source-out",
          animation: `${loading} 1s infinite linear`,
        },
      }}
    />
  );
};

export default Spinner;
