// ** Types
import { OwnerStateThemeType } from "./types";

const typography = {
  fontSize: 13.125,
  h1: {
    fontWeight: 500,
    fontSize: "2.375rem",
    lineHeight: 1.368421,
  },
  h2: {
    fontWeight: 500,
    fontSize: "2rem",
    lineHeight: 1.375,
  },
  h3: {
    fontWeight: 500,
    lineHeight: 1.38462,
    fontSize: "1.625rem",
  },
  h4: {
    fontWeight: 500,
    lineHeight: 1.364,
    fontSize: "1.375rem",
  },
  h5: {
    fontWeight: 500,
    lineHeight: 1.3334,
    fontSize: "1.125rem",
  },
  h6: {
    lineHeight: 1.4,
    fontSize: "0.9375rem",
  },
  subtitle1: {
    fontSize: "1rem",
    letterSpacing: "0.15px",
  },
  subtitle2: {
    lineHeight: 1.32,
    fontSize: "0.875rem",
    letterSpacing: "0.1px",
  },
  body1: {
    lineHeight: 1.467,
    fontSize: "0.9375rem",
  },
  body2: {
    fontSize: "0.8125rem",
    lineHeight: 1.53846154,
  },
  button: {
    lineHeight: 1.2,
    fontSize: "0.9375rem",
    letterSpacing: "0.43px",
  },
  caption: {
    lineHeight: 1.273,
    fontSize: "0.6875rem",
  },
  overline: {
    fontSize: "0.75rem",
    letterSpacing: "1px",
  },
  MuiTypography: {
    styleOverrides: {
      gutterBottom: ({ theme }: OwnerStateThemeType) => ({
        marginBottom: theme.spacing(2),
      }),
    },
    variants: [
      {
        props: { variant: "h1" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "h2" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "h3" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "h4" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "h5" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "h6" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "subtitle1" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "subtitle2" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.secondary,
        }),
      },
      {
        props: { variant: "body1" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "body2" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.secondary,
        }),
      },
      {
        props: { variant: "button" },
        style: ({ theme }: OwnerStateThemeType) => ({
          textTransform: "none",
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { variant: "caption" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.secondary,
        }),
      },
      {
        props: { variant: "overline" },
        style: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.secondary,
        }),
      },
    ],
  },
};

export default typography;
