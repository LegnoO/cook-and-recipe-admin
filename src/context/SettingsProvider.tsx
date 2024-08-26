// ** React
import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// ** Services
import { isRememberMeEnabled } from "@/services/authService";

// ** Types
export interface ISettingsContext {
  toggleDrawer: boolean;
  setToggleDrawer: Dispatch<SetStateAction<boolean>>;
  rememberMe: boolean;
  setRememberMe: Dispatch<SetStateAction<boolean>>;
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
  const [rememberMe, setRememberMe] = useState(isRememberMeEnabled);

  return (
    <SettingsContext.Provider
      value={{ toggleDrawer, setToggleDrawer, rememberMe, setRememberMe }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
