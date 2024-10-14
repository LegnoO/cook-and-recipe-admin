// ** React Imports
import { forwardRef } from "react";

// ** Mui Imports
import { Box, SxProps, useTheme } from "@mui/material";

// ** Utils
import { hexToRGBA, rgbaToHex } from "@/utils/helpers";

// ** Types
type Props = {
  label?: string;
  variant?: ColorVariant;
  sx?: SxProps;
};

const ChipStatus = forwardRef(
  ({ sx, label, variant = "success", ...props }: Props, ref) => {
    const theme = useTheme();
    const statusColorMap = {
      active: theme.palette.primary.main,
      success: theme.palette.success.main,
      disabled: rgbaToHex(theme.palette.text.disabled),
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      banned: theme.palette.error.dark,
    };

    return (
      <Box
        ref={ref}
        sx={{
          width: "fit-content",
          paddingInline: "0.625rem",
          paddingBlock: "0.125rem",
          fontWeight: 600,
          textAlign: "center",
          borderRadius: `${theme.shape.borderRadius - 2}px`,
          backgroundColor: hexToRGBA(statusColorMap[variant]!, 0.25),
          color: statusColorMap[variant],
          ...sx,
        }}
        {...props}>
        {label}
      </Box>
    );
  },
);
export default ChipStatus;
