// ** Library Imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

// ** Context
import GlobalProvider from "./context";

// test
import { useEffect, useRef } from "react";

const queryClient = new QueryClient();

const App = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (divRef.current) {
      // alert(divRef.current.clientWidth);
    }
  }, [divRef.current]);

  return (
    <div ref={divRef}>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <GlobalProvider>
            <ToastContainer />
            <Outlet />
          </GlobalProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
