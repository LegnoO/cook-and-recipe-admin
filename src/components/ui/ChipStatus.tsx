// ** Mui Imports
import { Box, SxProps } from "@mui/material";

// ** Utils
import { hexToRGBA } from "@/utils/helpers";

// ** Types
type Props = {
  label?: string;
  variant?: "error" | "success";
  sx?: SxProps;
};

const ChipStatus = ({ sx, label, variant = "success" }: Props) => {
  return (
    <Box
      sx={{
        width: "fit-content",
        paddingInline: "0.625rem",
        paddingBlock: "0.125rem",
        fontWeight: 600,
        textAlign: "center",
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        backgroundColor: (theme) =>
          hexToRGBA(theme.palette[variant].main, 0.25),
        color: (theme) => theme.palette[variant].main,
        ...sx,
      }}>
      {label}
    </Box>
  );
};
export default ChipStatus;
