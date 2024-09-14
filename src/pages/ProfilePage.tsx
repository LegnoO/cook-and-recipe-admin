// ** React Imports
import { useState, useRef, ChangeEvent, useEffect } from "react";

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
  InputAdornment,
  IconButton,
} from "@mui/material";

// ** Components
import {
  Icon,
  TextField,
  DatePicker,
  Container,
  Modal,
  Image,
} from "@/components/ui";

// ** Library
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** Services
import { getUserProfile } from "@/utils/services/authService";

// ** Schemas
import { ProfileFormSchema } from "@/utils/validations";

// ** Types
import { IProfileFormSchema } from "@/types/Schema";
import { updateEmployeeProfile } from "@/utils/services/userService";

// ** Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: `${theme.shape.borderRadius}px`,
  backgroundImage: "unset",
}));

const StyledForm = styled("form")({
  textAlign: "right",
});

export default function ProfilePage() {
  const {
    isLoading,
    // isError,
    // error,
    // isFetched,
    data: userProfile,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    retry: false,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { reset, control, handleSubmit } = useForm<IProfileFormSchema>({
    resolver: zodResolver(ProfileFormSchema),
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [zoomAvatar, setZoomAvatar] = useState(false);
  const formFields = [
    {
      name: "email",
      label: "Email",
      placeholder: "",
      disabled: true,
      icon: "carbon:email",
    },
    {
      name: "group",
      label: "Role",
      placeholder: "",
      disabled: true,
      icon: "la:user-cog",
    },
    {
      name: "fullName",
      label: "Full name",
      placeholder: "Enter your full name",
      icon: "material-symbols:person-outline-rounded",
    },
    {
      name: "username",
      label: "User name",
      placeholder: "Enter your user name",
      icon: "material-symbols:person-outline-rounded",
    },
    {
      name: "number",
      label: "Number",
      placeholder: "Enter your number",
      icon: "material-symbols:phonelink-ring",
    },
    {
      name: "city",
      label: "City address",
      placeholder: "Enter city address",
      icon: "fluent:city-24-regular",
    },
    {
      name: "street",
      label: "Street address",
      placeholder: "Enter street address",
      icon: "fluent:location-16-regular",
    },
    {
      name: "ward",
      label: "Ward address",
      placeholder: "Enter ward address",
      icon: "fluent:location-16-regular",
    },
    {
      name: "district",
      label: "District address",
      placeholder: "Enter district address",
      icon: "fluent:location-16-regular",
    },
  ];
  function handleReviewAvatar(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const fileReader = new FileReader();

    const file = event.target.files[0];

    if (file) {
      if (file.size > 2000000) {
        throw new Error("Upload failed: File size exceeds the 2MB limit.");
      }
      setFile(file);
      fileReader.onload = () => {
        setImage(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  }

  function triggerAvatarSelect() {
    if (!avatarInputRef.current) {
      return;
    }

    avatarInputRef.current.value = "";
    avatarInputRef.current.click();
  }

  function resetAllFields() {
    if (image) setImage(null);
    if (file) setFile(null);

    const profileData =
      sessionStorage.getItem("profile-data") &&
      JSON.parse(sessionStorage.getItem("profile-data")!);

    if (profileData) {
      reset({ ...userProfile, ...profileData });
    }
  }

  async function onSubmit(data: IProfileFormSchema) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    const { number, phone, district, ward, street } = data;

    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("avatar", file!);
    formData.append("phone", phone!);
    formData.append("dateOfBirth", data.dateOfBirth!);
    formData.append(
      "address",
      JSON.stringify({ number, phone, district, ward, street }),
    );

    try {
      await updateEmployeeProfile(formData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (userProfile) {
      const { address, ...userProfileRest } = userProfile;
      const updatedValues = { ...address, ...userProfileRest };
      reset(updatedValues);

      const { createdDate, group, email, ...updatedValuesRest } = updatedValues;
      const saveDraft = { ...updatedValuesRest };
      sessionStorage.setItem("profile-data", JSON.stringify(saveDraft));
    }
  }, [userProfile]);

  console.table({ userProfile });

  function handleZoomToggle() {
    setZoomAvatar((prev) => !prev);
  }

  return (
    <>
      <input
        ref={avatarInputRef}
        onChange={handleReviewAvatar}
        type="file"
        name="avatar"
        accept=".jpeg, .png, .webp"
        style={{ display: "none" }}
      />
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
              onClick={handleZoomToggle}
              sx={{
                height: { xs: 175, sm: 100 },
                width: { xs: 175, sm: 100 },
                overflow: "hidden",
                cursor: "pointer",
                borderRadius: (theme) => `${theme.shape.borderRadius}px`,
              }}>
              <Avatar
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectFit: "cover",
                }}
                alt={`Avatar ${userProfile?.username ?? "default"}`}
                src={image || userProfile?.avatar || undefined}
              />
              <Modal
                onClick={(event) => event.stopPropagation()}
                open={zoomAvatar}
                onClose={handleZoomToggle}>
                <Image
                  sx={{
                    maxHeight: "100dvh",
                    maxWidth: "75dvh",
                  }}
                  alt={`Avatar ${userProfile?.username ?? "default"}`}
                  src={image || userProfile?.avatar || undefined}
                />
              </Modal>
            </Box>
            <Stack direction="column" spacing={2}>
              <Stack
                direction="row"
                justifyContent={{ xs: "center", sm: "start" }}
                spacing={2}
                alignItems="center">
                <Button
                  disabled={isLoading}
                  sx={{ maxWidth: 220, fontWeight: 500 }}
                  onClick={triggerAvatarSelect}
                  variant="contained">
                  Change Avatar
                </Button>
              </Stack>

              <Typography variant="body1" color="text.secondary">
                Allowed JPG, PNG, or WEBP. Max size of 2 MB.
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ padding: "1.5rem" }}>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
              <Grid container rowSpacing={3} columnSpacing={3}>
                {formFields.map(
                  ({ name, label, placeholder, disabled, icon }) => (
                    <Grid item md={6} xs={12} key={name}>
                      <Controller
                        name={name as keyof IProfileFormSchema}
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextField
                            fullWidth
                            label={label}
                            placeholder={placeholder}
                            disabled={disabled}
                            variant="outlined"
                            value={value || ""}
                            onChange={onChange}
                            error={Boolean(error)}
                            helperText={error?.message}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton edge="end">
                                    <Icon fontSize="1.25rem" icon={icon} />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  ),
                )}
                <Grid item md={6} xs={12}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    rules={{ required: false }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <DatePicker
                        value={value ? dayjs(value) : null}
                        onChange={(date: Dayjs | null) => {
                          onChange(date ? date.toISOString() : null);
                        }}
                        fullWidth
                        slots={{
                          textField: TextField,
                        }}
                        slotProps={{
                          textField: {
                            label: "Date of birth",
                            fullWidth: true,
                            helperText: error ? error.message : null,
                            error: !!error,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Stack
                sx={{ mt: 6 }}
                direction="row"
                spacing={2}
                justifyContent="end"
                alignItems="center">
                <Button
                  disabled={isLoading}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                  onClick={resetAllFields}
                  color="secondary"
                  variant="contained">
                  Reset
                </Button>
                <Button
                  disabled={isLoading}
                  type="submit"
                  sx={{
                    width: { xs: "100%", md: "auto" },
                  }}
                  variant="contained">
                  Save changes
                </Button>
              </Stack>
            </StyledForm>
          </Box>
        </StyledPaper>
      </Container>
    </>
  );
}
