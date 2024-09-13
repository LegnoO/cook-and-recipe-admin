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
  Modal,
} from "@mui/material";

// ** Components
import Icon from "@/components/ui/Icon";
import TextField from "@/components/ui/TextField";
import DatePicker from "@/components/ui/DatePicker";
import Container from "@/components/ui/Container";

// ** Library
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs, { Dayjs } from "dayjs";

// ** Services
import { getUserProfile } from "@/services/authService";

// ** Schemas
import { ProfileFormSchema } from "@/lib/schema-validate/profileForm";


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
    data: userProfile,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    retry: false,
  });

  const FIELDS = [
    {
      name: "email",
      label: "Email",
      placeholder: "",
      icon: "carbon:email",
      disabled: true,
    },
    {
      name: "group",
      label: "Role",
      placeholder: "",
      icon: "la:user-cog",
      disabled: true,
    },
    {
      name: "fullName",
      label: "Full name",
      placeholder: "Enter full name",
      icon: "material-symbols:person-outline-rounded",
    },
    {
      name: "username",
      label: "User name",
      placeholder: "Enter user name",
      icon: "material-symbols:person-outline-rounded",
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
    },
  ];

  const { reset, control, handleSubmit } = useForm<ProfileFormSchema>({
    resolver: zodResolver(ProfileFormSchema),
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [zoomAvatar, setZoomAvatar] = useState(false);

  function handleReviewAvatar(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const fileReader = new FileReader();

    const file = event.target.files[0];

    if (file) {
      if (file.size > 2000000) {
        throw new Error("Upload failed: File size exceeds the 2MB limit.");
      }

      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        const bufferImage = fileReader.result as string;

        setImage(bufferImage);
      };
    }
  }

  // async function handleAvatarUpload() {
  //   const formData = new FormData();
  //   formData.append("file", image!);

  //   const res = await AxiosInstance.post(
  //     "https://e-learming-be.onrender.com/upload-image",
  //     formData,
  //   );
  //   console.log("🚀 ~ handleAvatarUpload ~ res:", res);
  // }

  function triggerAvatarSelect() {
    if (!avatarInputRef.current) {
      return;
    }

    avatarInputRef.current.value = "";
    avatarInputRef.current.click();
  }

  function resetAllFields() {
    if (image) setImage(null);
    const profileData =
      sessionStorage.getItem("profile-data") &&
      JSON.parse(sessionStorage.getItem("profile-data")!);

    if (profileData) {
      reset({ ...userProfile, ...profileData });
    }
  }

  async function onSubmit(data: ProfileFormSchema) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    // const { email, password } = data;
    // auth.login({ email, password, rememberMe }, () => {
    //   setError("email", {
    //     type: "manual",
    //     message: "Email or Password is invalid",
    //   });
    // });

    // await handleAvatarUpload();
  }

  useEffect(() => {
    if (userProfile) {
      const updatedValues = FIELDS.reduce((acc, field) => {
        const value = userProfile[field.name as keyof ProfileFormSchema];
        const key = field.name as keyof ProfileFormSchema;

        if (key !== "dateOfBirth" && typeof value === "string") {
          acc[key] = value;
        }

        if (key === "dateOfBirth") {
          acc[key] = value ? dayjs(value).toISOString() : null;
        }

        return acc;
      }, {} as Partial<ProfileFormSchema>);
      const { email, group, ...rest } = updatedValues;
      sessionStorage.setItem("profile-data", JSON.stringify({ ...rest }));
      reset(updatedValues);
    }
  }, [userProfile]);

  // console.table({ userProfile });

  // useEffect(() => {
  //   function beforeUnload(event: BeforeUnloadEvent) {}

  //   window.addEventListener("beforeunload", beforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", beforeUnload);
  //   };
  // }, []);

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
            direction="row"
            spacing={4}
            alignItems="center"
            padding="1.5rem">
            <Box
              onClick={handleZoomToggle}
              sx={{
                height: 100,
                width: 100,
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
                <Box
                  sx={{
                    position: "absolute" as "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
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
                </Box>
              </Modal>
            </Box>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  disabled={isLoading}
                  sx={{ maxWidth: 180, fontWeight: 500 }}
                  onClick={triggerAvatarSelect}
                  startIcon={<Icon icon="mdi-light:cloud-upload" />}
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
                {FIELDS.map((field, index) => (
                  <Grid key={index} item md={6} xs={12}>
                    {field.type === "date" ? (
                      <Controller
                        name={field.name as keyof ProfileFormSchema}
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
                                label: field.label,
                                fullWidth: true,
                                helperText: error ? error.message : null,
                                error: !!error,
                              },
                            }}
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        name={field.name as keyof ProfileFormSchema}
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextField
                            fullWidth
                            placeholder={field.placeholder || ""}
                            label={field.label}
                            disabled={field.disabled}
                            variant="outlined"
                            value={value || ""}
                            onChange={onChange}
                            error={Boolean(error)}
                            helperText={error ? error.message : null}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton edge="end">
                                    <Icon
                                      fontSize="1.25rem"
                                      icon={field.icon || ""}
                                    />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>

              <Stack
                sx={{ mt: 4 }}
                direction="row"
                spacing={2}
                alignItems="center">
                <Button
                  disabled={isLoading}
                  type="submit"
                  sx={{ mt: 4, fontWeight: "bold" }}
                  variant="contained">
                  Save changes
                </Button>
                <Button
                  disabled={isLoading}
                  sx={{ fontWeight: 500 }}
                  onClick={resetAllFields}
                  color="secondary"
                  variant="contained">
                  Reset
                </Button>
              </Stack>
            </StyledForm>
          </Box>
        </StyledPaper>
      </Container>
    </>
  );
}
