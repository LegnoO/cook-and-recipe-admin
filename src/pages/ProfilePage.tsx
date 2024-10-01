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
import { UploadImage, RenderFieldsControlled } from "@/components/";
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
import { createFormData } from "@/utils/helpers";

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
  const [avatarFileState, setAvatarFileState] = useState<
    Partial<{ file?: File; url?: string }>
  >({});

  const [profileDataDraft, setProfileDataDraft] = useStorage<UserProfileDraft>(
    "profile-data-draft",
    null,
    "session",
  );

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    ...queryOptions,
  });

  const { setValue, control, handleSubmit } = useForm<IProfileFormSchema>({
    resolver: zodResolver(ProfileFormSchema),
  });

  useEffect(() => {
    if (userProfile) {
      const fieldsToExclude = ["avatar"];

      Object.entries(userProfile)
        .filter(([key]) => !fieldsToExclude.includes(key))
        .forEach(([key, value]) => {
          setValue(key as keyof IProfileFormSchema, value, {
            shouldValidate: true,
          });
        });

      const { username, group, email, ...userProfileDraft } = userProfile;
      setProfileDataDraft(userProfileDraft);
    }
  }, [userProfile]);

  function handleFileSelect(file?: File, imageDataUrl?: string) {
    const newFileUpdated = { file, url: imageDataUrl };
    if (newFileUpdated) {
      setAvatarFileState(newFileUpdated);
    }
  }

  function handleResetFields() {
    if (avatarFileState) setAvatarFileState({});

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

    const profileData = {
      fullName: data.fullName,
      address: JSON.stringify(data.address) || undefined,
      dateOfBirth: String(data.dateOfBirth) || undefined,
      avatar: avatarFileState.file || undefined,
      phone: data.phone || undefined,
    };

    try {
      setLoading(true);
      const formData = createFormData(profileData);

      await updateEmployeeProfile(formData);
      refetch();
      refetchInfo();
      toast.success("Update successfully");
      setLoading(false);
      toast.dismiss(toastLoading);
    } catch (error) {
      handleAxiosError(error);
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
                alt={`Avatar ${userProfile?.fullName ?? "default"}`}
                src={avatarFileState?.url || userProfile?.avatar}
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
                  src={avatarFileState?.url || userProfile?.avatar}
                />
              </Modal>
            </Box>
            <Stack direction="column" spacing={2}>
              <Stack
                direction="row"
                justifyContent={{ xs: "center", sm: "start" }}
                alignItems="center">
                <UploadImage
                  name="avatar"
                  disabled={isProfileLoading || isLoading}
                  sx={{ width: 180, fontWeight: 500 }}
                  onFileSelect={handleFileSelect}>
                  Change Avatar
                </UploadImage>
              </Stack>

              <Typography variant="body1" color="text.secondary">
                Allowed JPEG, JPG, PNG, or WEBP. Max size of 2 MB.
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ pb: "1.5rem" }}>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
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
