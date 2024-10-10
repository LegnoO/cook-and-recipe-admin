// ** React Imports
import { ReactNode, MouseEventHandler ,memo} from "react";

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

const Modal = ({children, onClick, open, onClose, sx, ...rest }: Props) => {
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
