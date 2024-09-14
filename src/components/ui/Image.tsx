import { Box } from "@mui/material";

const Image = ({ ...props }) => {
  return (
    <Box
      sx={{ objectFit: "cover", borderRadius: "inherit" }}
      {...props}
      component="img"
    />
  );
};

export default Image;
