// ** React
import { useState, useEffect, createContext, ReactNode } from "react";

// ** Mui Imports
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Types
export type ModeType = "light" | "dark" | "system";

export interface IModeContext {
  mode: ModeType;
  setMode: (newMode: ModeType) => void;
}

// ** Props Types
type Props = {
  children: ReactNode;
};

// ** Create Context
export const ModeContext = createContext<IModeContext | undefined>(undefined);

const ModeProvider = ({ children }: Props) => {
  const modeStorage = localStorage.getItem("mode")
    ? JSON.parse(localStorage.getItem("mode")!).typeMode
    : null;
  const darkScheme = useMediaQuery("(prefers-color-scheme: dark)");
  const modeScheme = darkScheme ? "dark" : "light";
  const [mode, setMode] = useState<ModeType>(
    (modeStorage as ModeType) || (darkScheme ? "dark" : "light"),
  );
  // console.table({ mode });
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
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode: handleChangeMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeProvider;
