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

  return (
    <SettingsContext.Provider value={{ toggleDrawer, setToggleDrawer }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
