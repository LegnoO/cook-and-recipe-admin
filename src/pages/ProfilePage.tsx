// ** React Imports
import { useState, useEffect, Fragment } from "react";

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
import { UploadImage, RenderFieldsControlled } from "@/components";
import { Container, Modal, Image, Form } from "@/components/ui";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

// ** Services
import { getUserProfile } from "@/services/authService";

// ** Schemas
import {
  ProfileFormValues,
  profileFormSchema,
} from "@/schemas/profileFormSchema";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Hooks
import useStorage from "@/hooks/useStorage";
import useSettings from "@/hooks/useSettings";
import useAuth from "@/hooks/useAuth";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";
import { createFormData, handleToastMessages } from "@/utils/helpers";

// ** Services
import { updateProfileEmployee } from "@/services/employeeService";

// ** Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: `${theme.shape.borderRadius}px`,
  backgroundImage: "unset",
}));

export default function ProfilePage() {
  const profileFields: FormField[] = [
    {
      name: "fullName",
      label: "Full name",
      placeholder: "Enter your full name",
      required: true,
      type: "input",
      size: { md: 6 },
    },
    {
      name: "username",
      label: "User name",
      placeholder: "Enter your user name",
      type: "input",
      disabled: true,
      size: { md: 6 },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "",
      required: true,
      disabled: true,
      type: "input",
      size: { md: 6 },
    },
    {
      menuItems: ["Male", "Female", "Other"],
      disabled: true,
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      size: { md: 6 },
    },
    {
      name: "dateOfBirth",
      label: "Date of birth",
      type: "date",
      size: { md: 6 },
    },
    {
      name: "phone",
      label: "Phone",
      placeholder: "Enter your phone",
      type: "input",
      size: { md: 6 },
    },
    {
      type: "children",
      children: [
        {
          name: "address.number",
          label: "Number address",
          placeholder: "Enter your number",
          type: "input",
          size: { md: 4 },
        },
        {
          name: "address.street",
          label: "Street address",
          placeholder: "Enter street address",
          type: "input",
          size: { md: 4 },
        },
        {
          name: "address.ward",
          label: "Ward address",
          placeholder: "Enter ward address",
          type: "input",
          size: { md: 4 },
        },
        {
          name: "address.district",
          label: "District address",
          placeholder: "Enter district address",
          type: "input",
          size: { md: 6 },
        },
        {
          name: "address.city",
          label: "City address",
          placeholder: "Enter city address",
          type: "input",
          size: { md: 6 },
        },
      ],
    },
    {
      name: "group",
      label: "Role",
      placeholder: "",
      disabled: true,
      type: "input",
      size: { md: 6 },
    },
    {
      disabled: true,
      name: "createdDate",
      label: "Created date",
      type: "date",
      size: { md: 6 },
    },
  ];

  const zoomAvatarId = "zoom-avatar";
  const { refetchInfo } = useAuth();
  const { activeIds, addId, removeId } = useSettings();
  const [isLoading, setLoading] = useState(false);
  const [avatarFileState, setAvatarFileState] = useState<
    Partial<{ file?: File; url?: string }>
  >({});

  const [profileDataDraft, setProfileDataDraft] =
    useStorage<EmployeeProfileDraft>("profile-data-draft", null, "session");

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    ...queryOptions,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: null,
      group: "",
      username: "",
      gender: undefined,
      dateOfBirth: new Date(),
      createdDate: new Date(),
      address: null,
    },
  });

  useEffect(() => {
    if (userProfile) {
      const { avatar: avatarProfile, ...profile } = userProfile;

      form.reset(profile);

      const { group, email, avatar, gender, username, ...draft } = userProfile;
      setProfileDataDraft(draft);
    }
  }, [userProfile]);

  function handleFileSelect(file?: File, imageDataUrl?: string) {
    const newFileUpdated = { file, url: imageDataUrl };
    if (newFileUpdated) {
      setAvatarFileState(newFileUpdated);
    }
  }

  function handleResetFields() {
    if (profileDataDraft) {
      setAvatarFileState({});
      form.reset({ ...userProfile, ...profileDataDraft });
    }
  }

  async function onSubmit(data: ProfileFormValues) {
    const toastLoading = toast.loading("Loading...");

    const profileData = {
      fullName: data.fullName,
      address: JSON.stringify(data.address),
      dateOfBirth: String(data.dateOfBirth),
      avatar: avatarFileState.file,
      phone: data.phone,
    };

    try {
      setLoading(true);
      const formData = createFormData(profileData);
      await updateProfileEmployee(formData);
      refetch();
      refetchInfo();
      toast.success("Updated successfully");
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      const showErrorMessages = handleToastMessages((error) =>
        toast.error(error),
      );
      showErrorMessages(errorMessage);
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }

  return (
    <Fragment>
      <Box>
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
            sx={{ overFlow: "hidden", padding: "1.5rem" }}
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            alignItems="center">
            <Box
              sx={{
                height: { xs: 175, sm: 100 },
                width: { xs: 175, sm: 100 },
                overflow: "hidden",
                cursor: "pointer",
                borderRadius: (theme) => `${theme.shape.borderRadius}px`,
              }}>
              <Avatar
                onClick={() => addId(zoomAvatarId)}
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
                open={activeIds.includes(zoomAvatarId)}
                onClose={() => removeId(zoomAvatarId)}>
                <Image
                  sx={{
                    // maxHeight: "100%",
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
          <Box sx={{ paddingInline: "1.5rem", pb: "1.5rem" }}>
            <Form noValidate onSubmit={form.handleSubmit(onSubmit)}>
              <Grid container rowSpacing={3} columnSpacing={3}>
                {profileFields.map((field, index) => (
                  <Fragment key={index}>
                    <RenderFieldsControlled<ProfileFormValues>
                      field={field}
                      form={form}
                      id={String(index)}
                      name={field.name as Path<ProfileFormValues>}
                    />
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
                  onClick={handleResetFields}
                  color="error"
                  variant="tonal">
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
    </Fragment>
  );
}
