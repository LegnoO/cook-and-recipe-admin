// ** React
import { useState } from "react";

// ** MUI
import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";

import { styled } from "@mui/material/styles";

import {
  Box,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
  Button,
  Checkbox,
  Card,
} from "@mui/material";

// ** Components
import CustomTextField from "@/components/ui/CustomTextField";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

// ** Library
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** Schema Validate
import {
  LoginFormData,
  LoginFormSchema,
} from "@/lib/schema-validate/loginForm";

// ** Styled
const StyledForm = styled("form")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.primary.main} !important`,
}));

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    "& .MuiFormControlLabel-label": {
      color: theme.palette.text.secondary,
    },
  }),
);

const LoginPage = () => {
  const { handleSubmit, control } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginFormSchema),
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  function onSubmit(data: LoginFormData) {
    console.log(data);
  }

  function handleClickShowPassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <Box
      sx={{
        mt: "1.5rem",
        alignSelf: "center",
        maxWidth: "450px",
        width: "100%",
      }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
          boxShadow: (theme) => theme.shadows[3],
          overflow: "hidden",
          transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          width: "400px",
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

          <StyledForm
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextField
                  variant="outlined"
                  fullWidth
                  label="Email"
                  placeholder="Enter your email"
                  onChange={onChange}
                  value={value}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextField
                  variant="outlined"
                  fullWidth
                  label="Password"
                  onChange={onChange}
                  value={value}
                  placeholder="············"
                  type={showPassword ? "text" : "password"}
                  error={!!error}
                  helperText={error ? error.message : null}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={(e) => e.preventDefault()}>
                          <Icon
                            fontSize="1.25rem"
                            icon={
                              showPassword ? "tabler:eye" : "tabler:eye-off"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <FormControlLabel control={<Checkbox />} label="Remember Me" />
              <Typography
                component={LinkStyled}
                to="/pages/auth/forgot-password-v1">
                Forgot Password?
              </Typography>
            </Box>
            <Button
              sx={{ fontWeight: 500 }}
              fullWidth
              type="submit"
              variant="contained">
              Login
            </Button>
          </StyledForm>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
