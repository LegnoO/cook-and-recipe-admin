// ** MUI
import { Components, Theme } from "@mui/material/styles";

// ** Types
import { OwnerStateThemeType } from "./types";

const Tooltip = (): Components<Omit<Theme, "components">> => {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary,
          padding: "0.25rem 0.5rem",
          fontSize: theme.typography.body1.fontSize,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
        }),
        arrow: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.background.paper,
        }),
      },
    },
  };
};

export default Tooltip;
