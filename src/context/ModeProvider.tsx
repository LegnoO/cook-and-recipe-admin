"use client";

// ** React Imports
import { useState, useEffect, createContext, ReactNode } from "react";

// ** MUI Imports
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Types
export type ModeType = "light" | "dark" | "system";

export interface ModeContextType {
  mode: ModeType;
  setMode: (newMode: ModeType) => void;
}

// ** Props Types
type Props = {
  children: ReactNode;
};

const defaultProvider: ModeContextType = {
  mode: "light",
  setMode: () => null,
};

// ** Create Context
export const ModeContext = createContext(defaultProvider);

const ModeProvider = ({ children }: Props) => {
  const modeStorage = localStorage.getItem("mode")
    ? JSON.parse(localStorage.getItem("mode")!).typeMode
    : null;
  const darkScheme = useMediaQuery("(prefers-color-scheme: dark)");
  const modeScheme = darkScheme ? "dark" : "light";
  const [mode, setMode] = useState<ModeType>(
    (modeStorage as ModeType) || (darkScheme ? "dark" : "light"),
  );

  function handleChangeMode(newMode: ModeType): void {
    if (newMode === "system") {
      localStorage.setItem(
        "mode",
        JSON.stringify({
          typeMode: modeScheme,
          pickedMode: newMode,
        }),
      );
      setMode(modeScheme);
    } else {
      localStorage.setItem(
        "mode",
        JSON.stringify({
          typeMode: newMode,
          pickedMode: newMode,
        }),
      );
      setMode(newMode);
    }
  }

  useEffect(() => {
    localStorage.setItem(
      "mode",
      JSON.stringify({
        typeMode: mode,
        pickedMode: "system",
      }),
    );
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode: handleChangeMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeProvider;
