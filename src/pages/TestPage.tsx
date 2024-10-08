import { Box } from "@mui/material";


const TestPage = () => {
  return (
    <Box
      className="test"
      sx={{
        background: "red",
        maxHeight: "95dvh",
        width: "100%",
        overflowY: "auto",
      }}>
      <Box sx={{ height: 300, width: "100%" }}></Box>
    </Box>
  );
};
export default TestPage;
