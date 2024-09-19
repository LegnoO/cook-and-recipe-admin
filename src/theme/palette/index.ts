// ** Mui Imports
import { Palette } from "@mui/material";

// ** Constants
import {
  mainColors,
  defaultTextColor,
  commonColors,
  backgroundColors,
  textColors,
  supportColors,
  borderColors,
} from "@/config/palette";
import { hexToRGBA } from "@/utils/helpers";

// ** Types
interface newCustomPalette {
  dark: string;
  main: string;
  light: string;
  lightPaperBg: string;
  darkPaperBg: string;
  bodyBg: string;
  trackBg: string;
  avatarBg: string;
  tableHeaderBg: string;
  backdrop: string;
  borderColor: string;
  grey500: string;
}

// ** Declare
declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
    customColors: newCustomPalette;
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/styles/createMixins" {
  interface Mixins {
    header: CSSProperties;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
  interface ButtonPropsVariantOverrides {
    tonal: true;
  }
  interface ButtonClasses {
    tonal: string;
  }
}

const DefaultPalette = (mode: Palette["mode"]): Palette => {
  const textPrimary =
    mode === "light" ? textColors.primary.light : textColors.primary.dark;
  const textSecondary =
    mode === "light" ? textColors.secondary.light : textColors.secondary.dark;
  const borderColor = mode === "light" ? borderColors.light : borderColors.dark;
  const mainTextColor =
    mode === "light" ? defaultTextColor.light : defaultTextColor.dark;

  const customColors = {
    dark: textColors.primary.dark,
    main: mainTextColor,
    light: textColors.primary.light,
    lightPaperBg: commonColors.white,
    darkPaperBg:
      mode === "light"
        ? backgroundColors.paper.light
        : backgroundColors.paper.dark,
    bodyBg: mode === "light" ? "#F8F7FA" : "#25293C",
    trackBg: mode === "light" ? "#F1F0F2" : "#363B54",
    avatarBg: mode === "light" ? "#DBDADE" : "#4A5072",
    tableHeaderBg: mode === "light" ? "#F6F6F7" : "#4A5072",
    backdrop: "#2f2b3d80",
    borderColor,
  };

  return {
    customColors,
    mode: mode,
    common: {
      ...commonColors,
    },
    primary: {
      ...mainColors.primary,
    },
    secondary: {
      ...mainColors.secondary,
    },
    tertiary: {
      main: mode === "light" ? "#1C252E" : commonColors.white,
      contrastText: mode === "light" ? commonColors.white : "#1C252E",
    },
    error: {
      ...supportColors.error,
    },
    warning: {
      ...supportColors.warning,
    },
    info: {
      ...supportColors.info,
    },
    success: {
      ...supportColors.success,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: hexToRGBA(mainTextColor, 0.4),
    },
    divider: borderColor,
    background: {
      paper:
        mode === "light"
          ? backgroundColors.paper.light
          : backgroundColors.paper.dark,
      default:
        mode === "light"
          ? backgroundColors.body.light
          : backgroundColors.body.dark,
    },
    action: {
      active: hexToRGBA(mainTextColor, 0.54),
      selected: hexToRGBA(mainTextColor, 0.06),
      hover: hexToRGBA(mainTextColor, 0.06),
      disabled: hexToRGBA(mainTextColor, 0.26),
      disabledBackground: hexToRGBA(mainTextColor, 0.12),
      focus: hexToRGBA(mainTextColor, 0.12),
      selectedOpacity: 0.06,
      hoverOpacity: 0.04,
      disabledOpacity: 0.38,
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
  } as Palette;
};

export default DefaultPalette;
