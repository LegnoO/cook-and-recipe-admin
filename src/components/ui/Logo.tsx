// ** MUI Imports
import { useAuth } from "@/hooks/useAuth";
import { styled, useTheme } from "@mui/material/styles";
import test from "node:test";
import { Navigate } from "react-router-dom";

// ** Styled Components
const LogoLabel = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
  lineHeight: 1.09091,
  fontWeight: 700,
  fontSize: "1.375rem",
  letterSpacing: "0.25px",
  marginInlineStart: "0.75rem",
  opacity: 1,
  transition:
    "margin-inline-start 300ms ease-in-out 0s, opacity 300ms ease-in-out 0s",
}));

const StyledLogo = styled("div")({
  display: "flex",
  alignItems: "center",
});

// ** Types
interface IProps {
  hideLabel?: boolean;
  logoSize?: number;
}

const Logo = ({ logoSize = 40, hideLabel }: IProps) => {
  const theme = useTheme();
  const { test } = useAuth();
  const LogoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={logoSize}
      viewBox="0 0 512 512">
      <path
        fill={theme.palette.text.primary}
        d="M268.608 25.48c-26.47.197-43.568 5.534-55.357 13.75c-13.473 9.39-21.036 23.152-27.08 40.974c2.562 20.932 23.94 48.19 19.657 70.38c-16.48-28.212-33.466-67.988-63.31-76.116c-17.075-4.62-36.54-5.802-43.54-1.436c-8.273 5.16-13.81 14.76-16.943 26.854c-3.132 12.095-3.66 26.237-2.69 38.285c2.432 30.134 24.784 74.997 46.92 111.093c16.58 27.035 32.78 49.416 39.87 58.953a264 264 0 0 1 22.85-5.62c-1.538-18.02 1.384-34.673.828-53.947c4.206 18.19 7.84 34.576 14.275 51.36c12.383-1.772 25.42-2.8 38.85-2.82a262 262 0 0 1 28.256 1.463l14.22-41.562l-2.373 43.103c17.118 2.644 34.412 7.158 51.38 13.978c12.21-12.758 16.877-27.402 24.99-41.186c.398 16.003-4.507 31.896-15.052 45.464c8.902 4.1 17.684 8.87 26.268 14.38c41.514-67.15 66.69-133.49 61.885-198.7c-1.497-20.33-6.088-38.187-12.69-51.105c-6.6-12.92-14.827-20.444-23.493-22.704c-6.985-1.822-24.825 2.828-39.44 9.496c-26.947 10.81-48.5 45.717-55.894 69.53c-.253-11.64 3.003-44.39 15.947-60.698c-3.98-12.57-6.914-26.394-12.085-36.362c-10.442-16.115-20.236-16.91-36.247-16.806zm-26.836 289.85c-25.985.123-50.39 4.192-70.77 10.214l-11.626 98.96c10.16-5.65 22.32-9.144 35.318-11.17c9.958-1.553 20.53-2.233 31.362-2.17q2.32.015 4.658.073c12.457.313 25.19 1.57 37.674 3.582c24.965 4.023 48.854 11.044 67.463 20.175c7.344 3.604 14.094 7.5 19.717 11.9l8.33-96.945c-38.464-25.67-82.153-34.81-122.125-34.62zm-15.84 113.86c-10.017-.06-19.652.554-28.464 1.928c-16.116 2.513-29.044 7.62-37.168 14.707c50.417 46.585 123.38 52.03 190.373 22.225c-3.786-4.99-11.387-11.32-22.752-16.897c-16.367-8.032-38.93-14.78-62.398-18.562c-13.2-2.127-26.71-3.32-39.59-3.4z"></path>
    </svg>
  );

  return (
    <StyledLogo onClick={async() => await test() } className="logo">
      {LogoIcon}
      {!hideLabel && (
        <LogoLabel className="logo-label">Cook & Recipe</LogoLabel>
      )}
    </StyledLogo>
  );
};

export default Logo;
