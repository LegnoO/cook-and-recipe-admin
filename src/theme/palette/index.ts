// ** MUI Imports
import { Palette } from "@mui/material";

// ** Constants
import {
  mainColors,
  commonColors,
  backgroundColors,
  textColors,
  supportColors,
} from "@/utils/constants";

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
  const textColor = mode === "light" ? textColors.light : textColors.dark;

  const customColors = {
    dark: textColors.dark,
    main: textColor,
    light: textColors.light,
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
      primary: `rgba(${textColor}, 0.78)`,
      secondary: `rgba(${textColor}, 0.68)`,
      disabled: `rgba(${textColor}, 0.42)`,
    },
    divider: `rgba(${textColor}, 0.16)`,
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
      active: `rgba(${textColor}, 0.54)`,
      hover: `rgba(${textColor}, 0.04)`,
      selected: `rgba(${textColor}, 0.06)`,
      selectedOpacity: 0.06,
      disabled: `rgba(${textColor}, 0.26)`,
      disabledBackground: `rgba(${textColor}, 0.12)`,
      focus: `rgba(${textColor}, 0.12)`,
      hoverOpacity: 0.04,
      disabledOpacity: 0.38,
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
  } as Palette;
};

export default DefaultPalette;
