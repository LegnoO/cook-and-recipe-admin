// ** React
// import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
// ** Library
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

// ** Context
import ThemeProvider from "@/context/ThemeProvider.tsx";
import ModeProvider from "@/context/ModeProvider.tsx";

// ** Router
import router from "./routes";

// ** CSS
import "./styles/globals.css";
import "react-perfect-scrollbar/dist/css/styles.css";

const expectedSecretKey = "12f84f38-f45e-4d0d-b37a-9db6374cbc17";
const actualSecretKey = import.meta.env.VITE_SECRET_KEY;

if (actualSecretKey !== expectedSecretKey) {
  const messages = "Invalid Secret Key!";
  alert(messages);
  throw Error(messages);
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <StrictMode>

  <QueryClientProvider client={queryClient}>
    <ModeProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ModeProvider>
  </QueryClientProvider>,
  // </StrictMode>,
);
