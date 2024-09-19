// ** Mui Imports
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";

const DatePicker = styled(MuiDatePicker)({
  "&": { width: "100%" },
  "& .MuiInputBase-root input": { padding: "6.25px 0 6.25px 13px" },
  "& .MuiInputBase-root .MuiInputAdornment-root svg": {
    height: "22px",
    width: "22px",
  },
});

export default DatePicker;
