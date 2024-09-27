// ** React Imports
import { useState, useEffect } from "react";

// ** Mui Imports
import { styled } from "@mui/material/styles";

import {
  Box,
  Grid,
  Paper,
  Avatar,
  Typography,
  Button,
  Stack,
} from "@mui/material";

// ** Components
import { UploadImageButton, RenderFieldsControlled } from "@/components/";
import { Container, Modal, Image, Form } from "@/components/ui";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

// ** Services
import { getUserProfile } from "@/services/authService";

// ** Schemas
import { ProfileFormSchema } from "@/utils/validations";

// ** Config
import { profileFields } from "@/config/fields/profile-field";
import { queryOptions } from "@/config/query-options";

// ** Hooks
import useStorage from "@/hooks/useStorage";
import useSettings from "@/hooks/useSettings";
import useAuth from "@/hooks/useAuth";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";
import { updateEmployeeProfile } from "@/services/userService";

// ** Types
import { IProfileFormSchema } from "@/utils/validations";

// ** Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: `${theme.shape.borderRadius}px`,
  backgroundImage: "unset",
}));

export default function ProfilePage() {
  const { refetchInfo } = useAuth();
  const { activeIds, addId, removeId } = useSettings();
  const [isLoading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [profileDataDraft, setProfileDataDraft] = useStorage<UserProfileDraft>(
    "profile-data-draft",
    null,
    "session",
  );

  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    ...queryOptions,
  });

  const { setValue, control, handleSubmit } = useForm<IProfileFormSchema>({
    resolver: zodResolver(ProfileFormSchema),
  });

  useEffect(() => {
    if (userProfile) {
      const { avatar, ...userProfileRest } = userProfile;
      Object.entries(userProfile).forEach(([key, value]) => {
        console.log({ key, value });
        setValue(key as keyof IProfileFormSchema, value, {
          shouldValidate: true,
        });
      });

      const { username, group, email, ...userProfileDraft } = userProfileRest;
      setProfileDataDraft(userProfileDraft);
    }
  }, [userProfile]);

  function handleFileSelect(file: File | null, imageDataUrl: string | null) {
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(imageDataUrl);
    }
  }

  function handleResetFields() {
    if (avatarUrl) setAvatarUrl(null);
    if (avatarFile) setAvatarFile(null);

    if (profileDataDraft) {
      Object.entries({ ...userProfile, ...profileDataDraft }).forEach(
        ([key, value]) => {
          setValue(key as keyof IProfileFormSchema, value, {
            shouldValidate: true,
          });
        },
      );
    }
  }

  async function onSubmit(data: IProfileFormSchema) {
    const toastLoading = toast.loading("Loading...");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      if (data.address)
        formData.append("address", JSON.stringify(data.address));
      if (data.dateOfBirth)
        formData.append("dateOfBirth", String(data.dateOfBirth));
      if (avatarFile) formData.append("avatar", avatarFile);
      if (data.phone) formData.append("phone", data.phone);

      const newData = await updateEmployeeProfile(formData);
      const { group, email, avatar, ...restNewData } = newData;
      setProfileDataDraft(restNewData);
      refetchInfo();
      toast.success("Update successfully");
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }

  return (
    <>
      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{ fontWeight: 550 }}
          variant="h3"
          color="text.secondary">
          Account Information
        </Typography>
      </Box>
      <Container>
        <StyledPaper>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            alignItems="center"
            padding="1.5rem">
            <Box
              sx={{
                height: { xs: 175, sm: 100 },
                width: { xs: 175, sm: 100 },
                overflow: "hidden",
                cursor: "pointer",
                borderRadius: (theme) => `${theme.shape.borderRadius}px`,
              }}>
              <Avatar
                onClick={() => addId("zoom-avatar")}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectFit: "cover",
                }}
                alt={`Avatar ${userProfile?.username ?? "default"}`}
                src={avatarUrl || userProfile?.avatar || undefined}
              />
              <Modal
                scrollVertical
                open={activeIds.includes("zoom-avatar")}
                onClose={() => removeId("zoom-avatar")}>
                <Image
                  sx={{
                    maxHeight: "100dvh",
                    maxWidth: "75dvh",
                  }}
                  alt={`Avatar ${userProfile?.username ?? "default"}`}
                  src={avatarUrl || userProfile?.avatar || undefined}
                />
              </Modal>
            </Box>
            <Stack direction="column" spacing={2}>
              <Stack
                direction="row"
                justifyContent={{ xs: "center", sm: "start" }}
                alignItems="center">
                <UploadImageButton
                  name="avatar"
                  disabled={isProfileLoading || isLoading}
                  sx={{ width: 180, fontWeight: 500 }}
                  onFileSelect={handleFileSelect}>
                  Change Avatar
                </UploadImageButton>
              </Stack>

              <Typography variant="body1" color="text.secondary">
                Allowed JPEG, JPG, PNG, or WEBP. Max size of 2 MB.
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ pb: "1.5rem" }}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Grid container rowSpacing={3} columnSpacing={3}>
                {profileFields.map((field, index) => (
                  <RenderFieldsControlled
                    key={String(index)}
                    field={field}
                    control={control}
                    id={String(index)}
                  />
                ))}
              </Grid>
              <Stack
                sx={{ mt: 6 }}
                direction="row"
                spacing={2}
                justifyContent="end"
                alignItems="center">
                <Button
                  disabled={isProfileLoading || isLoading}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                  onClick={handleResetFields}
                  color="secondary"
                  variant="contained">
                  Reset
                </Button>
                <Button
                  disabled={isProfileLoading || isLoading}
                  type="submit"
                  sx={{
                    width: { xs: "100%", md: "auto" },
                  }}
                  variant="contained">
                  Save changes
                </Button>
              </Stack>
            </Form>
          </Box>
        </StyledPaper>
      </Container>
    </>
  );
}
