// ** React Imports
import { useState, ChangeEvent, useEffect } from "react";

// ** Mui Imports
import { Checkbox } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, CardContent, Typography, Button, Card } from "@mui/material";
import { Grid, InputAdornment, IconButton } from "@mui/material";
import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";

// ** Components
import { Icon, TextField } from "@/components/ui";
import { Logo, BouncingDotsLoader, Form } from "@/components/ui";
import ModeToggler from "@/components/ModeToggler";

// ** Library
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** Hooks
import useAuth from "@/hooks/useAuth";
import useStorage from "@/hooks/useStorage";

// ** Config
import { homeRoute } from "@/config/url";

// ** Schemas
import { loginFormSchema, LoginFormValues } from "@/schemas/loginFormSchema";

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

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    "& .MuiFormControlLabel-label": {
      color: theme.palette.text.secondary,
    },
  }),
);
const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login, isLoading, loadingError } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useStorage<boolean>(
    "rememberMe",
    false,
    "local",
  );

  const form = useForm<LoginFormValues>({
    defaultValues: {
      username: "admin123",
      password: "admin1234",
      rememberMe: rememberMe,
    },
    resolver: zodResolver(loginFormSchema),
  });

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  function toggleRememberMe(
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  ) {
    onChange(event);
    setRememberMe(event.target.checked);
  }

  useEffect(() => {
    if (user) {
      navigate(homeRoute);
    }
  }, []);

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
            sx={{
              minWidth: {
                sm: "100%",
                md: "inherit",
              },
            }}
            noPaper
            noValidate
            autoComplete="off"
            onSubmit={form.handleSubmit(login)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}>
              <Grid item md={6} xs={6}>
                <Controller
                  name={"username"}
                  control={form.control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      fullWidth
                      id={"username-field"}
                      label="Username"
                      placeholder="Enter your username"
                      variant="outlined"
                      value={value || ""}
                      onChange={onChange}
                      error={Boolean(error)}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Controller
                name="password"
                control={form.control}
                rules={{ required: true }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Password"
                    onChange={onChange}
                    value={value}
                    placeholder="············"
                    type={showPassword ? "text" : "password"}
                    error={Boolean(error)}
                    helperText={error?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={togglePasswordVisibility}
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
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          onChange={(event) =>
                            toggleRememberMe(event, onChange)
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
              {!isLoading ? (
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
              ) : (
                <Button
                  sx={{ minHeight: 38, fontWeight: 500 }}
                  fullWidth
                  variant="contained">
                  <BouncingDotsLoader />
                </Button>
              )}
            </Box>
          </Form>
        </CardContent>
      </Card>
      <ModeToggler drag />
    </Wrapper>
  );
};

export default LoginPage;
