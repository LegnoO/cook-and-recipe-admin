import { useContext } from "react";
import { ModeContext } from "@/context/ModeProvider";

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within an ModeProvider");
  }
  return context;
};
