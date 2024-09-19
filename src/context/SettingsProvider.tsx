// ** React
import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// ** Types
export interface ISettingsContext {
  toggleDrawer: boolean;
  setToggleDrawer: Dispatch<SetStateAction<boolean>>;
  listModal: string[];
  handleOpenModal: (id: string) => void;
  handleCloseModal: (id: string) => void;
}

type Props = {
  children: ReactNode;
};

// ** Create Context
export const SettingsContext = createContext<ISettingsContext | undefined>(
  undefined,
);

const SettingsProvider = ({ children }: Props) => {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [listModal, setToggleModal] = useState<string[]>([]);

  function handleOpenModal(modalId: string) {
    setToggleModal((prevId) =>
      prevId.includes(modalId)
        ? prevId.filter((id) => id !== modalId)
        : [...prevId, modalId],
    );
  }

  function handleCloseModal(modalId: string) {
    setToggleModal((prev) => prev.filter((id) => id !== modalId));
  }

  return (
    <SettingsContext.Provider
      value={{
        listModal,
        toggleDrawer,
        setToggleDrawer,
        handleOpenModal,
        handleCloseModal,
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
