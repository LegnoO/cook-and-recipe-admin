// ** React Imports
// import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// ** Context
import ThemeComponent from "@/context/ThemeProvider.tsx";
import ModeProvider from "@/context/ModeProvider.tsx";

// ** App
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ModeProvider>
    <ThemeComponent>
      <App />
    </ThemeComponent>
  </ModeProvider>,
  // </StrictMode>,
);
