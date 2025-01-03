import { Box } from "@mui/material";
import { useState } from "react";

const TestPage = () => {
  const [test, setTest] = useState("unmount");

  return (
    <Box sx={{ display: "flex", flexDiretion: "column", gap: 4 }}>
      <button onClick={() => setTest("mounted")}>test</button>
      <div>data: {test}</div>
    </Box>
  );
};
export default TestPage;
