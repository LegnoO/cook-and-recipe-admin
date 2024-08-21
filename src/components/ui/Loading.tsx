// ** MUI Imports
import { Box, keyframes, styled } from "@mui/material";

// ** Styled
const bounce = keyframes`
  to {
    transform: translateY(-0.25rem);
  }
`;

const LayoutWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "400px",
});
const Loader = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
});

const Dot = styled(Box)(({ theme }) => ({
  width: "0.75rem",
  height: "0.75rem",
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  animation: `${bounce} 0.425s infinite alternate`,
  "&:nth-of-type(1)": {
    animationDelay: "0ms",
  },
  "&:nth-of-type(2)": {
    animationDelay: "100ms",
  },
  "&:nth-of-type(3)": {
    animationDelay: "200ms",
  },
}));

interface IProps {
  layout?: boolean;
}

const Loading = ({ layout }: IProps) => {
  if (layout) {
    return (
      <LayoutWrapper className="suspense-loading-layout">
        <Loader>
          <Dot />
          <Dot />
          <Dot />
        </Loader>
      </LayoutWrapper>
    );
  }

  return (
    <Loader>
      <Dot
        sx={{ backgroundColor: (theme) => theme.palette.primary.contrastText }}
      />
      <Dot
        sx={{ backgroundColor: (theme) => theme.palette.primary.contrastText }}
      />
      <Dot
        sx={{ backgroundColor: (theme) => theme.palette.primary.contrastText }}
      />
    </Loader>
  );
};

export default Loading;
