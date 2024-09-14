// ** React Imports
import { ReactNode, MouseEventHandler } from "react";

// ** Mui Imports
import Box from "@mui/material/Box";
import MuiModal from "@mui/material/Modal";

// ** Types
interface ModalProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  open: boolean;
  onClose: () => void;
  [key: string]: any;
}
const Modal = ({ children, onClick, open, onClose, ...rest }: ModalProps) => {
  return (
    <MuiModal onClick={onClick} open={open} onClose={onClose} {...rest}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
        }}>
        {children}
      </Box>
    </MuiModal>
  );
};
export default Modal;
