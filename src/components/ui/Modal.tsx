// ** React Imports
import { ReactNode, MouseEventHandler } from "react";

// ** Mui Imports
import { Box, Backdrop, Fade } from "@mui/material/";
import MuiModal from "@mui/material/Modal";

// ** Types
type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  open: boolean;
  scrollVertical?: boolean;
  onClose: () => void;
};

const Modal = ({
  scrollVertical = false,
  children,
  onClick,
  open,
  onClose,
  ...rest
}: Props) => {
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
      onClose={onClose}
      {...rest}>
      <Fade in={open}>
        <Box
          sx={{
            outline: "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
            height: scrollVertical ? "95dvh" : "auto",
            overflowY: scrollVertical ? "auto" : "hidden",
          }}>
          {children}
        </Box>
      </Fade>
    </MuiModal>
  );
};
export default Modal;
