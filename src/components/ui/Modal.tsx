// ** React Imports
import { ReactNode, MouseEventHandler, memo } from "react";

// ** Mui Imports
import { Box, Backdrop, Fade, SxProps, Modal as MuiModal } from "@mui/material";

// ** Types
type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  open: boolean;
  onClose: () => void;
  sx?: SxProps;
};

const Modal = ({ children, onClick, open, onClose, sx, ...rest }: Props) => {
  return (
    <MuiModal
      onClick={onClose}
      aria-modal
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      open={open}
      {...rest}>
      <Fade in={open}>
        <Box
          onClick={(e) => e.stopPropagation()}
          className="overlay"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            outline: "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
            maxWidth: {
              sm: "500px",
            },
            borderRadius: (theme) => `${theme.shape.borderRadius}px`,
            overflow: "hidden",
            ...sx,
          }}>
          {children}
        </Box>
      </Fade>
    </MuiModal>
  );
};
export default memo(Modal);
