// ** Mui Imports
import { Box, keyframes, styled } from "@mui/material";

// ** Components
import { Repeat } from "@/components";

// ** Keyframes
const bounce = keyframes`
  to {
    transform: translateY(-0.25rem);
  }
`;

// ** Styled Components
const LayoutWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "400px",
});

const Loader = styled(Box)({
  minHeight: "0.9375rem",
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
});

const Dot = styled(Box)(({ theme }) => ({
  width: "0.5rem",
  height: "0.5rem",
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

// ** Types
type Props = {
  layout?: boolean;
};

const BouncingDotsLoader = ({ layout }: Props) => {
  const Dots = (
    <Loader>
      <Repeat times={3}>
        <Dot
          sx={{
            backgroundColor: layout
              ? undefined
              : (theme) => theme.palette.primary.contrastText,
          }}
        />
      </Repeat>
    </Loader>
  );

  if (layout) {
    return (
      <LayoutWrapper className="suspense-loading-layout">{Dots}</LayoutWrapper>
    );
  }

  return Dots;
};

export default BouncingDotsLoader;
