// ** MUI Imports
import { Box, keyframes, styled } from "@mui/material";

// ** Components
import Image from "@/components/Image";
import Logo from "@/components/ui/Logo";

// ** Images
import WaveAnimationGif from "@/assets/wave.gif";

// ** Styled Components
const wavePulse = keyframes`
0% {
    transform: scaleZ(1);
}
30% {
    transform: scale3d(1.1, 1.1, 1.1);
}
60% {
    transform: scale3d(1.1, 1.1, 1.1);
}
100% {
    transform: scaleZ(1);
}
`;

const LayoutWrapper = styled(Box)({
  position: "relative",
  display: "flex",
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100vh",
  zIndex: 2001,
});
const LayoutContent = styled(Box)({
  position: "relative",
});

const LoadingScreen = () => {
  return (
    <LayoutWrapper className="loading-full-screen">
      <LayoutContent>
        <Box
          sx={{
            "&": {
              position: "absolute",
              top: "50%",
              right: "50%",
              transform: "translate(50%, -50%)",
              zIndex: 2000,
            },
            "& .logo": { animation: `${wavePulse} 1.83s 0.4s infinite` },
          }}>
          <Logo logoSize={80} hideLabel />
        </Box>
        <Image src={WaveAnimationGif} alt="wave-animation" />
      </LayoutContent>
    </LayoutWrapper>
  );
};

export default LoadingScreen;
