// ** React Imports
import { useState } from "react";

// ** Mui Imports
import { Typography, Stack, Button } from "@mui/material";

// ** Components
import { Icon, TextField } from "@/components/ui";

// ** Library Imports
import { toast } from "react-toastify";

// ** Services
import { pushNotifySpecific } from "@/services/notifyService";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";

// ** Types
type Props = {
  variant: "success" | "error" | "info" | "warning";
  notificationContent?: {
    title: string;
    message: string;
    receiver: string;
  };

  boxContent: {
    textCancel?: string;
    textSubmit?: string;
    textContent: string;
    textTitle: string;
  };
  isLoading?: boolean;
  hideReason?: boolean;
  onClose?: () => void;
  onClick: () => Promise<void>;
  setReason?: (reason: string) => void;
};

const ConfirmBox = ({
  onClose,
  onClick,
  isLoading,
  boxContent,
  notificationContent,
  hideReason,
  variant = "success",
}: Props) => {
  const [reason, setReason] = useState(notificationContent?.message || "");
  const [error, setError] = useState(false);
  const {
    textCancel = "Cancel",
    textSubmit,
    textTitle,
    textContent,
  } = boxContent;

  const iconMap = {
    success: "icon-park-outline:success",
    error: "fluent:info-16-regular",
    info: "fluent:info-16-regular",
    warning: "lineicons:warning",
  };

  async function onSubmit() {
    if (!hideReason) {
      if (!reason) {
        setError(true);
        return;
      } else {
        setError(false);

        try {
          await onClick();
          if (notificationContent) {
            const { title, message, receiver } = notificationContent;
            await pushNotifySpecific({
              title,
              message: reason || message,
              receiver,
            });
          }
        } catch (error) {
          toast.error(handleAxiosError(error));
        }
      }
    } else {
      return;
    }
  }

  return (
    <Stack
      onClick={(event) => event.stopPropagation()}
      spacing={0}
      direction="column"
      alignItems="center"
      sx={{
        width: "100%",
        maxWidth: {
          sm: "425px",
        },
        padding: "1.5rem",
        borderRadius: (theme) => `${theme.shape.borderRadius + 10}px`,
        backgroundColor: (theme) => theme.palette.background.paper,
        boxShadow: 24,
      }}>
      <Button
        color={variant}
        sx={{ mb: 2, borderRadius: `50%`, height: 50, width: 50, p: 1 }}
        variant="tonal"
        disableRipple>
        <Icon fontSize="1.75rem" icon={iconMap[variant]} />
      </Button>
      <Typography
        sx={{ mb: 1 }}
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

      {!hideReason && (
        <TextField
          label="Enter your reason"
          multiline
          rows={2}
          variant="outlined"
          defaultValue={reason}
          fullWidth
          onChange={(event) => {
            setReason(event.target.value);
          }}
        />
      )}
      {error && !hideReason && (
        <Typography
          sx={{
            width: "100%",
            textAlign: "left",
            color: (theme) => theme.palette.error.main,
          }}>
          Required
        </Typography>
      )}
      <Stack
        sx={{
          mt: "1.5rem",
          justifyContent: "end",
          width: "100%",
          gap: "0.75rem",
        }}
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
          onClick={onSubmit}
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
