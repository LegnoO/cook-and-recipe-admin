// ** React Imports
import { useState } from "react";

// ** Mui Imports
import { Typography, Button, Stack } from "@mui/material";

// ** Library Imports
import PerfectScrollbar from "react-perfect-scrollbar";

import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";

// ** Components
import { Form, TextField } from "@/components/ui";

// ** Services
import { pushNotifyAll } from "@/services/notifyService";

// ** Schemas
import {
  PushNotifySchemaValues,
  pushNotifySchema,
} from "@/schemas/pushNotifySchema";

// ** Types
type Props = {
  closeMenu: () => void;
};

const BroadcastNotification = ({ closeMenu }: Props) => {
  const form = useForm<PushNotifySchemaValues>({
    resolver: zodResolver(pushNotifySchema),
  });

  const [isLoading, setLoading] = useState(false);

  async function onSubmit(data: PushNotifySchemaValues) {
    const toastLoading = toast.loading("Loading...");

    try {
      setLoading(true);

      await pushNotifyAll(data);
      toast.success("Broadcast notification successfully");
      setLoading(false);
      closeMenu();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      toast.dismiss(toastLoading);
    }
  }

  return (
    <PerfectScrollbar options={{ wheelPropagation: false }}>
      <Form
        sx={{
          maxHeight: "95dvh",
        }}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}>
        <Stack
          sx={{
            borderRadius: "inherit",
            backgroundColor: (theme) => theme.palette.background.paper,
            height: "auto",
            padding: "1.5rem",
          }}
          direction="column"
          alignItems="center">
          <Typography
            fontWeight={500}
            component="h2"
            sx={{ width: "100%", textAlign: "left", mb: "1.25rem" }}
            variant="h5">
            Broadcast Notification
          </Typography>
          <Stack sx={{ width: "100%", flexDirection: "column", gap: "1rem" }}>
            <Controller
              name="title"
              control={form.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  label="Title"
                  placeholder="Enter Title"
                  disabled={isLoading}
                  variant="outlined"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="message"
              control={form.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  label="Message"
                  placeholder="Enter Message"
                  disabled={isLoading}
                  variant="outlined"
                  value={value || ""}
                  onChange={onChange}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
          </Stack>
          <Stack
            direction="row"
            sx={{
              gap: 1.5,
              justifyContent: "space-between",
              width: "100%",
              marginTop: "auto",
              paddingTop: "1.5rem",
            }}>
            <Button
              type="button"
              onClick={closeMenu}
              sx={{ width: { xs: "100%", md: "auto" } }}
              color="secondary"
              variant="contained">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              sx={{
                width: { xs: "100%", md: "auto" },
              }}
              variant="contained">
              Broadcast
            </Button>
          </Stack>
        </Stack>
      </Form>
    </PerfectScrollbar>
  );
};
export default BroadcastNotification;
