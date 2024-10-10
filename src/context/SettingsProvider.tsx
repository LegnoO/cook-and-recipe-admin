// ** React
import { useState, createContext, ReactNode } from "react";

// ** Types
export interface ISettingsContext {
  activeIds: string[];
  addId: (id: string) => void;
  removeId: (id: string) => void;
  toggleId: (id: string) => void;
  setId: (id: string) => void;
}

type Props = {
  children: ReactNode;
};

// ** Create Context
export const SettingsContext = createContext<ISettingsContext | undefined>(
  undefined,
);

const SettingsProvider = ({ children }: Props) => {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  function toggleId(modalId: string) {
    setActiveIds((prevId) =>
      prevId.includes(modalId)
        ? prevId.filter((id) => id !== modalId)
        : [...prevId, modalId],
    );
  }

  function addId(id: string) {
    if (!activeIds.includes(id)) {
      setActiveIds((prevIds) => [...prevIds, id]);
    }
  }

  function removeId(modalId: string) {
    setActiveIds((prev) => prev.filter((id) => id !== modalId));
  }

  function setId(modalId: string) {
    setActiveIds([modalId]);
  }

  return (
    <SettingsContext.Provider
      value={{
        activeIds,
        addId,
        removeId,
        toggleId,
        setId,
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
