// ** React Imports
import { useState } from "react";

// ** Mui Imports
import { styled } from "@mui/material/styles";
import { Box, CardContent, Typography, Button, Card } from "@mui/material";

// ** Components
import { Logo, BouncingDotsLoader, Form } from "@/components/ui";
import ModeToggler from "@/components/ModeToggler";
import RenderFieldsControlled from "@/components/RenderFieldsControlled";

// ** Library
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** Hooks
import useAuth from "@/hooks/useAuth";
import useStorage from "@/hooks/useStorage";

// ** Utils
import { LoginFormSchema } from "@/utils/validations";
import { ILoginFormSchema } from "@/utils/validations";

// ** Config
import { RenderIf } from "@/components";
import { PasswordInput, RememberCheckBox } from "@/components/fields";

// ** Styled Components

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.primary.main} !important`,
}));

const Wrapper = styled(Box)(({ theme }) => ({
  marginTop: "1.5rem",
  alignSelf: "center",
  maxWidth: "400px",
  width: "100%",
  [theme.breakpoints.down("xs")]: {
    maxWidth: "100%",
  },
}));

const LoginPage = () => {
  const userNameField: FormField = {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
    type: "input",
    size: { md: 6 },
  };

  const { login, isLoading, loadingError } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useStorage<boolean>(
    "rememberMe",
    false,
    "local",
  );

  const { handleSubmit, control } = useForm<ILoginFormSchema>({
    defaultValues: {
      username: "admin123",
      password: "admin1234",
      rememberMe: rememberMe,
    },
    resolver: zodResolver(LoginFormSchema),
  });

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <Wrapper className="LoginPage-Wrapper">
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
          boxShadow: (theme) => theme.shadows[3],
          overflow: "hidden",
          transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        }}>
        <CardContent
          sx={{
            "&": { padding: "3rem !important" },
            "& .logo": { justifyContent: "center", mb: "1.5rem" },
          }}>
          <Logo />
          <Box sx={{ mb: "1.5rem" }}>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "0.9375rem",
                lineHeight: 1.46667,
              }}
              color="text.primary"
              variant="body1">
              Please sign-in to your account
            </Typography>
          </Box>

          <Form
            noPaper
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(login)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}>
              <RenderFieldsControlled
                field={userNameField}
                control={control}
                id={userNameField.name as string}
              />
              <PasswordInput
                showPassword={showPassword}
                togglePassword={togglePasswordVisibility}
                control={control}
              />
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <RememberCheckBox
                  setRememberMe={setRememberMe}
                  control={control}
                />

                <Typography
                  component={LinkStyled}
                  to="/pages/auth/forgot-password-v1">
                  Forgot Password?
                </Typography>
              </Box>
              <RenderIf
                condition={!isLoading}
                fallback={
                  <Button
                    sx={{ minHeight: 38, fontWeight: 500 }}
                    fullWidth
                    variant="contained">
                    <BouncingDotsLoader />
                  </Button>
                }>
                <Box>
                  {loadingError && (
                    <Typography sx={{ mb: 1.75 }} color="error">
                      {loadingError}
                    </Typography>
                  )}
                  <Button
                    sx={{ minHeight: 38, fontWeight: 500 }}
                    fullWidth
                    type="submit"
                    variant="contained">
                    Login
                  </Button>
                </Box>
              </RenderIf>
            </Box>
          </Form>
        </CardContent>
      </Card>
      <ModeToggler drag />
    </Wrapper>
  );
};

export default LoginPage;
