// ** React Imports
import { forwardRef, ImgHTMLAttributes } from "react";

// ** Mui Imports
import { Box, BoxProps } from "@mui/material";

// ** Types
type Props = BoxProps & ImgHTMLAttributes<HTMLImageElement>;

const Image = forwardRef(({ sx, ...props }: Props, ref) => {
  return (
    <Box
      ref={ref}
      sx={{ objectFit: "cover", borderRadius: "inherit", ...sx }}
      {...props}
      component="img"
    />
  );
});

export default Image;
