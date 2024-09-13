import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePicker = ({ ...rest }) => {
  return (
    <MuiDatePicker
      className="test"
      sx={{
        "&": { width: "100%" },
        "& .MuiInputBase-root input": { padding: "6.25px 0 6.25px 13px" },
        "& .MuiInputBase-root .MuiInputAdornment-root svg": {
          height: "22px",
          width: "22px",
        },
      }}
      {...rest}
    />
  );
};
export default DatePicker;
