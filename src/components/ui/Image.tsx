// ** React Imports
import { ImgHTMLAttributes } from "react";

// ** Mui Imports
import { Box, BoxProps } from "@mui/material";

// ** Types
type Props = BoxProps & ImgHTMLAttributes<HTMLImageElement>;

const Image = ({ sx, ...props }: Props) => {
  return (
    <Box
      sx={{ objectFit: "cover", borderRadius: "inherit", ...sx }}
      {...props}
      component="img"
    />
  );
};

export default Image;
