// ** Util Import
import { hexToRGBA } from "@/utils/color";

// ** MUI Imports
import { Components, Theme } from "@mui/material/styles";

// ** Types
import { OwnerStateThemeType } from "./types";

const Button = (): Components<Omit<Theme, "components">> => {
  return {
    MuiButton: {
      variants: [
        {
          props: { variant: "text", color: "primary" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "text", color: "secondary" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "text", color: "tertiary" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.tertiary.main, 0.8),
            },
          }),
        },
        {
          props: { variant: "contained", color: "tertiary" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.tertiary.main, 0.8),
            },
          }),
        },
        {
          props: { variant: "text", color: "success" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.success.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "text", color: "error" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.error.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "text", color: "warning" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.warning.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "text", color: "info" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.info.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "outlined", color: "primary" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "outlined", color: "secondary" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "outlined", color: "success" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.success.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "outlined", color: "error" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.error.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "outlined", color: "warning" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.warning.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "outlined", color: "info" },
          style: ({ theme }: { theme: Theme }) => ({
            "&:hover": {
              backgroundColor: hexToRGBA(theme.palette.info.main, 0.08),
            },
          }),
        },
        {
          props: { variant: "tonal", color: "primary" },
          style: ({ theme }: { theme: Theme }) => ({
            color: theme.palette.primary.main,
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.16),
            "&:hover, &:active": {
              backgroundColor: hexToRGBA(theme.palette.primary.main, 0.24),
            },
          }),
        },
      ],
      styleOverrides: {
        root: ({ ownerState, theme }: OwnerStateThemeType) => ({
          minWidth: 50,
          textTransform: "none",
          "&:not(.Mui-disabled):active": {
            transform: "scale(0.98)",
          },
          transition: theme.transitions.create(
            [
              "background-color",
              "box-shadow",
              "border-color",
              "color",
              "transform",
            ],
            { duration: theme.transitions.duration.shortest },
          ),
          ...(ownerState.size === "medium" &&
            ownerState.variant === "text" && {
              padding: theme.spacing(2.5, 3),
            }),
        }),
        endIcon: ({ ownerState }: OwnerStateThemeType) => ({
          ...(ownerState.size === "small" && {
            "& > *:nth-of-type(1)": {
              fontSize: "1rem",
            },
          }),
          ...(ownerState.size === "medium" && {
            "& > *:nth-of-type(1)": {
              fontSize: "1.125rem",
            },
          }),
          ...(ownerState.size === "large" && {
            "& > *:nth-of-type(1)": {
              fontSize: "1.25rem",
            },
          }),
        }),
        startIcon: ({ ownerState }: OwnerStateThemeType) => ({
          ...(ownerState.size === "small" && {
            "& > *:nth-of-type(1)": {
              fontSize: "1rem",
            },
          }),
          ...(ownerState.size === "medium" && {
            "& > *:nth-of-type(1)": {
              fontSize: "1.125rem",
            },
          }),
          ...(ownerState.size === "large" && {
            "& > *:nth-of-type(1)": {
              fontSize: "1.25rem",
            },
          }),
        }),
        contained: ({ theme }: { theme: Theme }) => ({
          boxShadow: theme.shadows[2],
          padding: "0.625rem 1.25rem",
          "&:hover": {
            boxShadow: theme.shadows[2],
          },
        }),
        tonal: ({ theme }: { theme: Theme }) => ({
          padding: "0.625rem 1.25rem",
          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        }),
        outlined: ({ theme, ownerState }: OwnerStateThemeType) => ({
          padding: "0.625rem 1.25rem",
          ...(ownerState.color === "primary" && {
            borderColor: theme.palette.primary.main,
          }),
          ...(ownerState.color === "secondary" && {
            borderColor: theme.palette.secondary.main,
          }),
          ...(ownerState.color === "tertiary" && {
            borderColor: theme.palette.secondary.main,
          }),
          ...(ownerState.color === "success" && {
            borderColor: theme.palette.success.main,
          }),
          ...(ownerState.color === "error" && {
            borderColor: theme.palette.error.main,
          }),
          ...(ownerState.color === "warning" && {
            borderColor: theme.palette.warning.main,
          }),
          ...(ownerState.color === "info" && {
            borderColor: theme.palette.info.main,
          }),
        }),
        sizeSmall: ({ ownerState, theme }: OwnerStateThemeType) => ({
          lineHeight: 1.231,
          borderRadius: "4px",
          fontSize: "0.8125rem",
          ...(ownerState.variant === "text" && {
            padding: theme.spacing(1.5, 2.25),
          }),
          ...(ownerState.variant === "contained" && {
            padding: theme.spacing(1.5, 3.5),
          }),
          ...(ownerState.variant === "outlined" && {
            padding: theme.spacing(1.25, 3.25),
          }),
        }),
        sizeLarge: ({ ownerState, theme }: OwnerStateThemeType) => ({
          lineHeight: 1.295,
          borderRadius: "8px",
          fontSize: "1.0625rem",
          ...(ownerState.variant === "text" && {
            padding: theme.spacing(3.25, 4),
          }),
          ...(ownerState.variant === "contained" && {
            padding: theme.spacing(3.25, 6.5),
          }),
          ...(ownerState.variant === "outlined" && {
            padding: theme.spacing(3, 6.25),
          }),
        }),
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
  };
};

export default Button;
