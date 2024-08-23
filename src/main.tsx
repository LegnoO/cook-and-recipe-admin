// ** React
import ReactDOM from "react-dom/client";
// import { StrictMode } from "react";

// ** Library
import { RouterProvider } from "react-router-dom";

// ** Router
import router from "./routes";

// ** CSS
import "./styles/globals.css";
import "react-perfect-scrollbar/dist/css/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <StrictMode>

  <RouterProvider router={router} />,

  // </StrictMode>,
);
