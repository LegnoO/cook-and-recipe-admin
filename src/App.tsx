// ** Library Imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

// ** Context
import GlobalProvider from "./context";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <GlobalProvider>
          <ToastContainer />
          <Outlet />
        </GlobalProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default App;
