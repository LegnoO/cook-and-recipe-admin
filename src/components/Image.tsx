import { Box } from "@mui/material";

const Image = ({ ...props }) => {
  return <Box {...props} component="img" />;
};

export default Image;
