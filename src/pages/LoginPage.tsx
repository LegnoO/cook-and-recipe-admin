// ** React Imports
import { useState, ChangeEvent } from "react";

// ** Mui Imports
import { styled } from "@mui/material/styles";
import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
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
import { Icon, Logo, Loading, TextField } from "@/components/ui";
import ModeToggler from "@/components/ModeToggler";

// ** Library
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** Hooks
import { useAuth } from "@/hooks/useAuth";
import useLocalStorage from "@/hooks/useLocalStorage";

// ** Utils
import { LoginFormSchema } from "@/utils/validations";

// ** Types
import { ILoginFormSchema } from "@/types/schemas";

// ** Styled Components
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
  const { login, isLoading, loadingError } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useLocalStorage<boolean>(
    "rememberMe",
    false,
  );

  const { handleSubmit, control } = useForm<ILoginFormSchema>({
    defaultValues: {
      username: "admin123",
      password: "admin1234",
      rememberMe: rememberMe,
    },
    resolver: zodResolver(LoginFormSchema),
  });

  function handleClickShowPassword() {
    setShowPassword((prev) => !prev);
  }

  const handleChangeRememberMe = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  ) => {
    onChange(event);
    setRememberMe(event.target.checked);
  };

  return (
    <>
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

            <StyledForm
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(login)}>
              <Controller
                name="username"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    label="username"
                    placeholder="Enter your username"
                    variant="outlined"
                    value={field.value}
                    onChange={field.onChange}
                    error={Boolean(fieldState.error)}
                    helperText={
                      fieldState.error ? fieldState.error.message : null
                    }
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Password"
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="············"
                    type={showPassword ? "text" : "password"}
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error ? fieldState.error.message : null
                    }
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
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(event) =>
                            handleChangeRememberMe(event, field.onChange)
                          }
                        />
                      }
                      label="Remember Me"
                    />
                  )}
                />

                <Typography
                  component={LinkStyled}
                  to="/pages/auth/forgot-password-v1">
                  Forgot Password?
                </Typography>
              </Box>
              {isLoading ? (
                <Button sx={{ fontWeight: 500 }} fullWidth variant="contained">
                  <Loading />
                </Button>
              ) : (
                <Box>
                  {loadingError && (
                    <Typography sx={{ mb: 1.75 }} color="error">
                      {loadingError}
                    </Typography>
                  )}
                  <Button
                    sx={{ fontWeight: 500 }}
                    fullWidth
                    type="submit"
                    variant="contained">
                    Login
                  </Button>
                </Box>
              )}
            </StyledForm>
          </CardContent>
        </Card>
      </Wrapper>
      <ModeToggler drag />
    </>
  );
};

export default LoginPage;
