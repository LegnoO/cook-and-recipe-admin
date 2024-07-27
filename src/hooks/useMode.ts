import { useContext } from "react";
import { ModeContext, ModeContextType } from "@/context/ModeProvider";

export const useMode: () => ModeContextType = () => useContext(ModeContext);
