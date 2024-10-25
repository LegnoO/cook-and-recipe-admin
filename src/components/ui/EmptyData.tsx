// ** Mui Imports
import { Box, Typography } from "@mui/material";

// ** Components
import { Image } from "@/components/ui";

// ** Assets
import NoDataIcon from "@/assets/ic-content.svg";

const EmptyData = () => {
  return (
    <Box
      className="no-data-found"
      sx={{
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 1,
        paddingInline: "1.5rem",
        paddingBlock: "4rem",
      }}>
      <Image
        sx={{ mx: "auto" }}
        width="150px"
        height="150px"
        alt="no data icon"
        src={NoDataIcon}
      />
      <Typography
        sx={{ color: (theme) => theme.palette.text.disabled }}
        fontWeight="600"
        variant="subtitle1">
        No Data
      </Typography>
    </Box>
  );
};

export default EmptyData;
