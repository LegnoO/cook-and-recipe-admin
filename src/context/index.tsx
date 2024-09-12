// ** React Imports
import { ReactNode } from "react";

// ** Context
import ThemeProvider from "@/context/ThemeProvider";
import ModeProvider from "@/context/ModeProvider";
import AuthProvider from "@/context/AuthProvider";
import SettingsProvider from "@/context/SettingsProvider";

// ** Types
type Props = {
  children: ReactNode;
};

const GlobalProvider = ({ children }: Props) => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ModeProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ModeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default GlobalProvider;
