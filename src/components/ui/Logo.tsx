// ** MUI Imports
import { styled, useTheme } from "@mui/material/styles";

// ** Props
interface IProps {
  hideLabel?: boolean;
}

// ** Styled
export const LogoLabel = styled("span")(({ theme }) => ({
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

export const StyledLogo = styled("div")({
  display: "flex",
  alignItems: "center",
});

const Logo = ({ hideLabel }: IProps) => {
  const theme = useTheme();

  const LogoIcon = (
    <svg
      className="logo-icon"
      width={34}
      viewBox="0 0 32 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={theme.palette.primary.main}
        d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
      />
      <path
        fill="#161616"
        opacity={0.06}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
      />
      <path
        fill="#161616"
        opacity={0.06}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={theme.palette.primary.main}
        d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
      />
    </svg>
  );

  return (
    <StyledLogo className="logo">
      {LogoIcon}
      {!hideLabel && (
        <LogoLabel className="logo-label">Cook & Recipe</LogoLabel>
      )}
    </StyledLogo>
  );
};

export default Logo;
