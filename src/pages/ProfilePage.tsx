// ** React Imports
import { useState, useRef, ChangeEvent, useEffect } from "react";

// ** Mui Imports
import { styled } from "@mui/material/styles";
import {
  Box,
  Container,
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
import Icon from "@/components/ui/Icon";
import CustomTextField from "@/components/ui/TextField";

// ** Library
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** Services
import { getUserProfile } from "@/services/authService";

// ** Schemas
import { ProfileFormSchema } from "@/lib/schema-validate/profileForm";
import AxiosInstance from "@/utils/axios";
import { isObjectEmpty } from "@/utils/helpers";

// ** Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: `${theme.shape.borderRadius}px`,
  backgroundImage: "unset",
}));

const StyledForm = styled("form")({
  textAlign: "right",
});

// ** Types
interface FormValues {
  fullName: string;
  username: string;
  email: string;
  group: string;
}

export default function ProfilePage() {
  const {
    // isLoading,
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
      name: "email",
      label: "Email",
      placeholder: "",
      icon: "material-symbols:person-outline-rounded",
    },
    {
      name: "group",
      label: "Role",
      placeholder: "",
      icon: "material-symbols:person-outline-rounded",
    },
    // {
    //   name: "dateOfBirth",
    //   label: "Date of birth",
    //   placeholder: "Enter your birthday",
    //   icon: "material-symbols:person-outline-rounded",
    // },
  ];

  const { reset, control, handleSubmit, getValues } = useForm<FormValues>({
    resolver: zodResolver(ProfileFormSchema),
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);

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
        console.log("🚀 ~ handleReviewAvatar ~ bufferImage:", bufferImage);

        setImage(bufferImage);
      };
    }
  }

  async function handleUploadAvatar() {
    const formData = new FormData();
    formData.append("file", image!);

    const res = await AxiosInstance.post(
      "https://e-learming-be.onrender.com/upload-image",
      formData,
    );
    console.log("🚀 ~ handleUploadAvatar ~ res:", res);
  }

  function handleSelectAvatar() {
    if (!avatarInputRef.current) {
      return;
    }

    avatarInputRef.current.value = "";
    avatarInputRef.current.click();
  }

  function handleResetAvatar() {
    if (image) setImage(null);
  }

  async function onSubmit(data: FormValues) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    // const { email, password } = data;
    // auth.login({ email, password, rememberMe }, () => {
    //   setError("email", {
    //     type: "manual",
    //     message: "Email or Password is invalid",
    //   });
    // });

    await handleUploadAvatar();
  }

  useEffect(() => {
    const formValues = getValues();

    if (!isObjectEmpty(formValues) && userProfile) {
      const updatedValues: Partial<FormValues> = {};
      FIELDS.forEach((field) => {
        updatedValues[field.name as keyof FormValues] =
          userProfile[field.name as keyof FormValues];
      });
      reset(updatedValues);
    }
  }, [userProfile]);

  console.table({ userProfile });

  return (
    <>
      <input
        ref={avatarInputRef}
        onChange={handleReviewAvatar}
        type="file"
        name="avatar"
        accept=".jpeg, .png, .webp"
        style={{ width: 0, height: 0 }}
      />
      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{ fontWeight: 550 }}
          variant="h3"
          color="text.secondary">
          Account Information
        </Typography>
      </Box>
      <Container sx={{ padding: "0px !important" }}>
        <StyledPaper>
          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            padding="1.5rem">
            <Box
              sx={{
                height: 100,
                width: 100,
                overflow: "hidden",
                borderRadius: (theme) => `${theme.shape.borderRadius}px`,
              }}>
              <Avatar
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectFit: "cover",
                }}
                alt={`Avatar ${userProfile?.username}` || "Avatar default"}
                src={image ? image : userProfile?.avatar || undefined}
              />
            </Box>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  sx={{ fontWeight: 500 }}
                  onClick={handleSelectAvatar}
                  startIcon={<Icon icon="mdi-light:cloud-upload" />}
                  variant="contained">
                  Upload New Photo
                </Button>
                <Button
                  sx={{ fontWeight: 500 }}
                  onClick={handleResetAvatar}
                  color="secondary"
                  // startIcon={<Icon icon="mdi-light:cloud-upload" />}
                  variant="contained">
                  Reset
                </Button>
              </Stack>

              <Typography variant="body1" color="text.secondary">
                Allowed JPG, PNG, or WEBP. Max size of 2 MB.
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ padding: "1.5rem" }}>
            <StyledForm
              sx={{ display: "flex", flexWrap: "wrap" }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}>
              <Grid container rowSpacing={3} columnSpacing={3}>
                {FIELDS.map((field, index) => (
                  <Grid key={index} item md={6} xs={12}>
                    <Controller
                      name={field.name as keyof FormValues}
                      control={control}
                      rules={{ required: true }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <CustomTextField
                          fullWidth
                          placeholder={field.placeholder}
                          label={field.label}
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
                  </Grid>
                ))}
              </Grid>

              <Button sx={{ mt: 4, fontWeight: "bold" }} variant="contained">
                Save changes
              </Button>
            </StyledForm>
          </Box>
        </StyledPaper>
      </Container>
    </>
  );
}
