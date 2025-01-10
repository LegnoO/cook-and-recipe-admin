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
      aria-modal
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (onClick) onClick(event);
      }}
      open={open}
      {...rest}>
      <Fade in={open}>
        <Box
          onClick={onClose}
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
            borderRadius: (theme) => `${theme.shape.borderRadius}px`,
            overflow: "hidden",
            ...sx,
          }}>
          <Box
            className="modal-content"
            onClick={(event) => event.stopPropagation()}>
            {children}
          </Box>
        </Box>
      </Fade>
    </MuiModal>
  );
};
export default memo(Modal);
