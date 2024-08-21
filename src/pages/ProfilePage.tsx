// ** React Imports
import { useState, useRef, ChangeEvent } from "react";

// ** Mui Imports
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import {
  Box,
  Container,
  Grid,
  Paper,
  Avatar,
  Typography,
  Button,
} from "@mui/material";

// ** Components
import Icon from "@/components/ui/Icon";

// ** Utils
import { hexToRGBA } from "@/utils/color";
import CustomTextField from "@/components/ui/TextField";

// ** Library
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormSchema } from "@/lib/schema-validate/profileForm";

// ** Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  paddingInline: "1.5rem",
  paddingBlock: "2rem",
  boxShadow: theme.shadows[2],
  borderRadius: `${theme.shape.borderRadius}px`,
  backgroundImage: "unset",
}));

const StyledForm = styled("form")({
  textAlign: "right",
});

interface FormData {
  fullName: string;
}

export default function ProfilePage() {
  const {
    control,

    handleSubmit,
  } = useForm({
    defaultValues: {
      fullName: "emilys",
    },
    resolver: zodResolver(ProfileFormSchema),
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  // const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<string | null>(null);

  function handleAvatarReview(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.accept);
    if (!event.target.files) return;
    const fileReader = new FileReader();
    const file = event.target.files[0];
    if (file) {
      console.log("🚀 ~ handleAvatarReview ~ file:", file);
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
  // async function test() {
  //   const formData = new FormData();

  //   formData.append("file", files[0]);

  //   const res = await axios.post(
  //     "https://e-learming-be.onrender.com/upload-image",
  //     formData,
  //     {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTYwNTkxNWQ2OTMxOGMwMWIzY2ZlMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMTU5MjQwMiwiZXhwIjoxNzIxNjI4NDAyfQ.MS2kv1uq4rr1bgOqexiT_ExpHZB_8Qp_WcAEjGLqv-k`,
  //       },
  //     },
  //   );
  //   console.log("🚀 ~ test ~ res:", res);
  // }
  function handleUploadAvatar() {
    if (!avatarInputRef.current) {
      return;
    }

    avatarInputRef.current.click();
  }

  function onSubmit(data: FormData) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    // const { email, password } = data;
    // auth.login({ email, password, rememberMe }, () => {
    //   setError("email", {
    //     type: "manual",
    //     message: "Email or Password is invalid",
    //   });
    // });
  }

  return (
    <Container sx={{ padding: "0px !important" }}>
      <input
        ref={avatarInputRef}
        onChange={handleAvatarReview}
        type="file"
        name="avatar"
        accept=".jpeg, .png, .webp"
        style={{ width: 0, height: 0 }}
      />
      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <StyledPaper>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}>
              <Box
                sx={{
                  mx: "auto",
                  mb: "0.5rem",
                  height: "144px",
                  width: "144px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  padding: "0.5rem",
                  border: `1px solid ${hexToRGBA(grey[500], 0.2)}`,
                }}>
                <Avatar
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                    objectFit: "cover",
                  }}
                  alt={"test"}
                  src={image || "/images/avatar-default.png"}
                />
              </Box>
              <Typography
                sx={{ textAlign: "center" }}
                variant="caption"
                color="text.secondary">
                Allowed *.jpeg, *.jpg, *.png, *.gif, *.webp
              </Typography>
              <Typography
                sx={{ textAlign: "center" }}
                variant="caption"
                color="text.secondary">
                max size of 2 Mb
              </Typography>
              <Button
                onClick={handleUploadAvatar}
                startIcon={<Icon icon="mdi-light:cloud-upload" />}
                sx={{
                  alignSelf: "center",
                  minWidth: "200px",
                  maxWidth: "300px",
                  mt: "0.5rem",
                  borderRadius: "50px",
                }}
                variant="outlined">
                Upload
              </Button>
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item md={8} xs={12}>
          <StyledPaper>
            <StyledForm
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={(theme) => ({
                  display: "grid",
                  gap: "1.5rem 1rem",
                  mb: "1.5rem",
                  [theme.breakpoints.up("xs")]: {
                    gridTemplateColumns: "repeat(1, 1fr)",
                  },
                  [theme.breakpoints.up("md")]: {
                    gridTemplateColumns: "repeat(2, 1fr)",
                  },
                })}>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <CustomTextField
                      fullWidth
                      label="Full name"
                      placeholder="Full name"
                      variant="outlined"
                      value={value}
                      onChange={onChange}
                      error={Boolean(error)}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Box>
              <Button
                sx={{ fontWeight: "bold" }}
                variant="contained"
                color="tertiary">
                Save changes
              </Button>
            </StyledForm>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
}
