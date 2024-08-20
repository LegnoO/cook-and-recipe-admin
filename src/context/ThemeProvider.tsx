// ** React
import { ReactNode } from "react";

// ** MUI Imports
import { CssBaseline, Palette } from "@mui/material";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

// ** Hooks
import { useMode } from "@/hooks/useMode";

// ** Theme Override Imports
import palette from "@/theme/palette";
import shadows from "@/theme/shadows";
import breakpoints from "@/theme/breakpoints";
import typography from "@/theme/typography";
import overrides from "@/theme/overrides";

// ** Props
interface Props {
  children: ReactNode;
}

const ThemeComponent = ({ children }: Props) => {
  const { mode } = useMode();

  let theme = createTheme({
    components: overrides(),
    typography: typography,
    breakpoints: breakpoints(),
    palette: palette(mode as Palette["mode"]),
    shadows: shadows(mode as Palette["mode"]),
    shape: {
      borderRadius: 6,
    },
    mixins: {
      header: {
        minHeight: 54,
      },
      toolbar: {
        minHeight: 56,
      },
    },
  });

  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};

export default ThemeComponent;
