// ** React Imports
import {} from "react";

// ** Mui Imports
import { Typography, Stack, Button } from "@mui/material";

// ** Components
import { Icon } from "@/components/ui";

// ** Types
type Props = {
  variant: "success" | "error" | "info" | "warning";
  textCancel?: string;
  textSubmit?: string;
  textContent: string;
  textTitle: string;
  isLoading?: boolean;
  onClose?: () => void;
  onClick: () => void;
};

const ConfirmBox = ({
  onClose,
  onClick,
  isLoading,
  textCancel = "Cancel",
  textSubmit = "Yes",
  textTitle = "Title",
  textContent = 'You are going to delete the "Demo" project.',
  variant = "success",
}: Props) => {
  const iconMap = {
    success: "icon-park-outline:success",
    error: "fluent:info-16-regular",
    info: "fluent:info-16-regular",
    warning: "lineicons:warning",
  };

  return (
    <Stack
      spacing={0}
      direction="column"
      alignItems="center"
      sx={{
        width: "100%",
        maxWidth: {
          sm: "360px",
        },
        padding: "1.5rem",
        borderRadius: (theme) => `${theme.shape.borderRadius + 10}px`,
        backgroundColor: (theme) => theme.palette.background.paper,
        boxShadow: (theme) => theme.shadows[6],
      }}>
      <Button
        color={variant}
        sx={{ mb: 2, borderRadius: `50%`, height: 50, width: 50, p: 1 }}
        variant="tonal"
        disableRipple>
        <Icon fontSize="1.75rem" icon={iconMap[variant]} />
      </Button>
      <Typography
        sx={{ width: "100%", mb: 1.5 }}
        fontWeight={600}
        variant="body1"
        color="text.primary">
        {textTitle}
      </Typography>

      <Typography
        sx={{
          mb: 2.5,
          lineHeight: "1.25rem",
        }}
        fontWeight={400}
        variant="subtitle2"
        color="text.primary">
        {textContent}
      </Typography>
      <Stack
        sx={{ justifyContent: "end", width: "100%", gap: "0.75rem" }}
        direction="row">
        <Button
          onClick={onClose}
          sx={{ fontWeight: 500 }}
          variant="contained"
          color="secondary">
          {textCancel}
        </Button>
        <Button
          disabled={isLoading}
          onClick={onClick}
          sx={{ fontWeight: 500 }}
          variant="contained"
          color={variant}>
          {textSubmit}
        </Button>
      </Stack>
    </Stack>
  );
};
export default ConfirmBox;
