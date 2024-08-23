// ** Library
import { Outlet } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ** Context
import ThemeProvider from "@/context/ThemeProvider";
import ModeProvider from "@/context/ModeProvider";
import AuthProvider from "@/context/AuthProvider";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModeProvider>
          <ThemeProvider>
            <Outlet />
          </ThemeProvider>
        </ModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
