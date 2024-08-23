import { useContext } from "react";
import { SettingsContext } from "@/context/SettingsProvider";

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within an SettingsProvider");
  }
  return context;
};
