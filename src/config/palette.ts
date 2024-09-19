import { hexToRGBA } from "@/utils/helpers";

export const defaultTextColor = {
  light: "#212636",
  dark: "#e1def5",
};

export const textColors = {
  primary: {
    light: "#212636",
    dark: hexToRGBA(defaultTextColor.dark, 0.9),
  },
  secondary: {
    light: "#667085",
    dark: hexToRGBA(defaultTextColor.dark, 0.7),
  },
};

export const commonColors = {
  white: "#fff",
  black: "#040316",
};

export const borderColors = {
  light: "#2F2B3D",
  dark: hexToRGBA(defaultTextColor.dark, 0.12),
};

export const backgroundColors = {
  body: {
    light: "#fafafa",
    dark: "#25293C",
  },
  paper: {
    light: "#fff",
    dark: "#2F3349",
  },
};

export const mainColors = {
  primary: {
    main: "#5646ce",
    dark: "#4131B9",
    contrastText: commonColors.white,
  },
  secondary: {
    main: "#A8AAAE",
    dark: "#949699",
    contrastText: commonColors.white,
  },
};

export const supportColors = {
  error: {
    main: "#EA5455",
    dark: "#ac1515",
    contrastText: commonColors.white,
  },
  warning: {
    main: "#ff9e42",
    dark: "#bd5b00",
    contrastText: commonColors.white,
  },
  info: {
    main: "#00CFE8",
    dark: "#00cfe6",
    contrastText: commonColors.white,
  },
  success: {
    main: "#24B364",
    dark: "#37d77f",
    contrastText: commonColors.white,
  },
};
