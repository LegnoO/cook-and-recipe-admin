// ** React Imports
import { useState, Fragment, useEffect } from "react";

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
import UploadImageButton from "@/components/UploadImageButton";
import Fields from "@/components/Fields";
import { Container, Modal, Image, Form } from "@/components/ui";

// ** Library
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

// ** Services
import { getUserProfile } from "@/utils/services/authService";

// ** Schemas
import { ProfileFormSchema } from "@/utils/validations";

// ** Config
import { profileFields } from "@/config/fields/profile-field";
import { queryOptions } from "@/config/query-options";

// ** Hooks
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";
import { updateEmployeeProfile } from "@/utils/services/userService";

// ** Types
import { IProfileFormSchema } from "@/types/schemas";

// ** Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: `${theme.shape.borderRadius}px`,
  backgroundImage: "unset",
}));

export default function ProfilePage() {
  const [isLoading, setLoading] = useState(false);
  const { refetchInfo } = useAuth();
  const { listModal, handleOpenModal, handleCloseModal } = useSettings();
  const { isLoading: isProfileLoading, data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    ...queryOptions,
  });

  const { reset, control, handleSubmit } = useForm<IProfileFormSchema>({
    resolver: zodResolver(ProfileFormSchema),
  });

  const [file, setFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleFileSelect = (file: File | null, imageDataUrl: string | null) => {
    if (file) {
      setFile(file);
      setAvatarPreview(imageDataUrl);
    }
  };

  function resetAllFields() {
    if (avatarPreview) setAvatarPreview(null);
    if (file) setFile(null);

    const profileData =
      sessionStorage.getItem("profile-data") &&
      JSON.parse(sessionStorage.getItem("profile-data")!);

    if (profileData) {
      reset({ ...userProfile, ...profileData });
    }
  }

  async function onSubmit(data: IProfileFormSchema) {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      if (data.address)
        formData.append("address", JSON.stringify(data.address));
      if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
      if (file) formData.append("avatar", file);
      if (data.phone) formData.append("phone", data.phone);

      await updateEmployeeProfile(formData);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      refetchInfo();
      toast.success("Update successfully");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userProfile) {
      const { avatar, ...userProfileRest } = userProfile;
      const updatedValues = {
        ...userProfileRest,
      };
      reset(updatedValues);

      const { group, email, ...updatedValuesRest } = updatedValues;
      const saveDraft = { ...updatedValuesRest };
      sessionStorage.setItem("profile-data", JSON.stringify(saveDraft));
    }
  }, [userProfile]);

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
                onClick={() => handleOpenModal("zoom-avatar")}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectFit: "cover",
                }}
                alt={`Avatar ${userProfile?.username ?? "default"}`}
                src={avatarPreview || userProfile?.avatar || undefined}
              />
              <Modal
                open={listModal.includes("zoom-avatar")}
                onClose={() => handleCloseModal("zoom-avatar")}>
                <Image
                  sx={{
                    maxHeight: "100dvh",
                    maxWidth: "75dvh",
                  }}
                  alt={`Avatar ${userProfile?.username ?? "default"}`}
                  src={avatarPreview || userProfile?.avatar || undefined}
                />
              </Modal>
            </Box>
            <Stack direction="column" spacing={2}>
              <Stack
                direction="row"
                justifyContent={{ xs: "center", sm: "start" }}
                spacing={2}
                alignItems="center">
                <UploadImageButton
                  name="avatar"
                  disabled={isProfileLoading || isLoading}
                  sx={{ maxWidth: 220, fontWeight: 500 }}
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
                  <Fragment key={index}>
                    <Fields field={field} control={control} />
                  </Fragment>
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
                  onClick={resetAllFields}
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
