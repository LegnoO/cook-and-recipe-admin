// ** MUI Imports
import { Palette } from "@mui/material";
import { grey } from "@mui/material/colors";

// ** Utils
import { adjustRgbColor } from "@/utils/color";

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
  const whiteColor = "#fff";
  const lightColor = "47, 43, 61";
  const darkColor = "208, 212, 241";
  const mainColor = mode === "light" ? lightColor : darkColor;
  const bodyColor = mode === "light" ? grey[50] : "#141A21";
  const paperColor = mode === "light" ? whiteColor : "#1C252E";

  const customColors = {
    dark: darkColor,
    main: mainColor,
    light: lightColor,
    lightPaperBg: whiteColor,
    darkPaperBg: paperColor,
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
      black: "#000",
      white: whiteColor,
    },
    primary: {
      light: "#fad396",
      main: adjustRgbColor("rgb(253, 189, 150)", 1, "hex"),
      dark: adjustRgbColor("rgb(253, 189, 150)", 0.9, "hex"),
      contrastText: whiteColor,
    },
    secondary: {
      light: "#B2B4B8",
      main: "#A8AAAE",
      dark: "#949699",
      contrastText: whiteColor,
    },
    tertiary: {
      main: mode === "light" ? "#1C252E" : whiteColor,
      contrastText: mode === "light" ? whiteColor : "#1C252E",
    },
    error: {
      light: "#ED6F70",
      main: "#EA5455",
      dark: "#fff",
      contrastText: whiteColor,
    },
    warning: {
      light: "#FFAB5A",
      main: "#FF9F43",
      dark: "#E08C3B",
      contrastText: whiteColor,
    },
    info: {
      light: "#1FD5EB",
      main: "#00CFE8",
      dark: "#00B6CC",
      contrastText: whiteColor,
    },
    success: {
      light: "#42CE80",
      main: "#28C76F",
      dark: "#23AF62",
      contrastText: whiteColor,
    },
    text: {
      primary: `rgba(${mainColor}, 0.78)`,
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.42)`,
    },
    divider: `rgba(${mainColor}, 0.16)`,
    background: {
      paper: paperColor,
      default: bodyColor,
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.06)`,
      selectedOpacity: 0.06,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`,
      hoverOpacity: 0.04, // default
      disabledOpacity: 0.38, // default
      focusOpacity: 0.12, // default
      activatedOpacity: 0.12, // default
    },
  } as Palette;
};

export default DefaultPalette;
