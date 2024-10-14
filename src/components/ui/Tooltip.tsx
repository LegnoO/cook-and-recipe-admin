// ** Mui Imports
import { styled } from "@mui/material/styles";
import MuiTooltip, { TooltipProps } from "@mui/material/Tooltip";

// ** Utils
import { hexToRGBA } from "@/utils/helpers";

// ** Styled Components
const ToBeStyledTooltip = ({ className, ...rest }: TooltipProps) => {
  return <MuiTooltip {...rest} classes={{ tooltip: className }} />;
};

const Tooltip = styled(ToBeStyledTooltip)<TooltipProps>(({ theme }) => ({
  "&": {
    backgroundColor: hexToRGBA(theme.palette.background.paper, 1, 15),
    color: theme.palette.text.primary,
    padding: "0.25rem 0.5rem",
    fontSize: theme.typography.body1.fontSize,
    boxShadow: theme.shadows[6],
  },
  "& .MuiTooltip-arrow": {
    color: hexToRGBA(theme.palette.background.paper, 1, 15),
  },
}));

export default Tooltip;
