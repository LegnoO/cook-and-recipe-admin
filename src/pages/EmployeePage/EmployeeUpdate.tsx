// ** React Imports
import { useState, useEffect, Fragment, Dispatch, SetStateAction } from "react";

// ** Mui Imports
import {
  Grid,
  Typography,
  Button,
  Stack,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";

// ** Components
import { RenderFieldsControlled, UploadImage } from "@/components";
import { Form, Icon, ModalLoading } from "@/components/ui";
import { GroupSelect, PhoneInput } from "@/components/fields";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { getEmployeeDetail, updateEmployee } from "@/services/employeeService";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useForm, Path, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";
import {
  createFormData,
  formatPhoneNumber,
  handleToastMessages,
  hexToRGBA,
} from "@/utils/helpers";

// ** Schemas
import {
  updateEmployeeSchema,
  UpdateEmployeeValues,
} from "@/schemas/updateEmployeeSchema";

// ** Types
type Props = {
  employeeId: string;
  closeMenu: () => void;
  setController: Dispatch<SetStateAction<AbortController | null>>;
  refetch: () => void;
};

const EmployeeUpdate = ({
  employeeId,
  closeMenu,
  setController,
  refetch,
}: Props) => {
  const TITLE = "Update Information";
  const updateEmployeeField: FormField[] = [
    {
      name: "fullName",
      label: "Full name",
      placeholder: "Enter fullName",
      type: "input",
      size: { md: 6 },
    },
    {
      name: "username",
      label: "User name",
      placeholder: "Enter fullName",
      type: "input",
      size: { md: 6 },
      disabled: true,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter email",
      type: "input",
      size: { md: 6 },
    },
    {
      menuItems: ["Male", "Female", "Other"],
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
      type: "children",
      children: [
        {
          name: "address.number",
          label: "Number",
          placeholder: "Enter your number",

          type: "input",
          size: { md: 6 },
        },

        {
          name: "address.street",
          label: "Street address",
          placeholder: "Enter street address",

          type: "input",
          size: { md: 6 },
        },
        {
          name: "address.ward",
          label: "Ward address",
          placeholder: "Enter ward address",

          type: "input",
          size: { md: 6 },
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
  ];

  const { data: employeeDetail, isLoading: employeeLoading } = useQuery({
    queryKey: ["employee-detail", employeeId],

    queryFn: () => getEmployeeDetail(employeeId),
    ...queryOptions,
  });

  const [isLoading, setLoading] = useState(false);

  const form = useForm<UpdateEmployeeValues>({
    resolver: zodResolver(updateEmployeeSchema),
  });

  const avatar = form.watch("avatar");

  function handleFileSelect(file: File, imageDataUrl: string) {
    const newFileUpdated = { file, url: imageDataUrl };
    if (newFileUpdated) {
      form.setValue("avatar", newFileUpdated);
    }
  }

  async function onSubmit(data: UpdateEmployeeValues) {
    const toastLoading = toast.loading("Loading...");

    const employeePayload = {
      fullName: data.fullName,
      groupId: data.groupId,
      address: JSON.stringify(data.address),
      email: data.email,
      gender: data.gender,
      phone: data.phone,
      avatar: avatar ? avatar.file : employeeDetail?.avatar,
      dateOfBirth: String(data.dateOfBirth),
    };

    try {
      setLoading(true);
      const formData = createFormData(employeePayload);
      const newController = new AbortController();
      setController(newController);
      await updateEmployee(formData, employeeId, newController);
      toast.success("Updated successfully");
      refetch();
      closeMenu();

      setController(null);
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }

  useEffect(() => {
    if (employeeDetail) {
      console.log("🚀 ~ useEffect ~ employeeDetail:", employeeDetail);
      form.reset({
        ...employeeDetail,
        groupId: employeeDetail.group.id,
        avatar: { url: employeeDetail.avatar },
      });
    }
  }, [employeeDetail]);

  if (employeeLoading) {
    return <ModalLoading title={TITLE} closeMenu={closeMenu} />;
  }

  return (
    <PerfectScrollbar
      options={{ useBothWheelAxes: true, wheelPropagation: false }}>
      <Form
        sx={{
          width: "100%",
          position: "relative",
          maxHeight: "95dvh",
        }}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}>
        <Stack
          sx={{
            borderRadius: "inherit",
            backgroundColor: (theme) => theme.palette.background.paper,
            height: "auto",
            padding: "1.5rem",
          }}
          direction={"column"}>
          <Typography
            fontWeight={500}
            component="h3"
            sx={{ textAlign: { xs: "center", sm: "left" }, mb: "2.75rem" }}
            variant="h4">
            {TITLE}
          </Typography>

          <Box className="modal-loading-info">
            <Stack sx={{ mb: 5 }} direction="column" alignItems="center">
              <Box
                className="upload-avatar"
                sx={{
                  "&": {
                    height: 125,
                    width: 125,
                    mb: 3,
                    cursor: "pointer",
                    position: "relative",
                  },
                }}>
                <Avatar
                  alt={`Avatar ${employeeDetail?.fullName ?? "default"}`}
                  src={avatar?.url}
                  sx={{ height: "100%", width: "100%" }}
                />

                <UploadImage
                  type="react-node"
                  name="avatar"
                  onFileSelect={handleFileSelect}>
                  <Stack
                    direction="column"
                    justifyContent={"center"}
                    alignItems="center"
                    spacing={1}
                    className="upload-avatar-placeholder"
                    sx={{
                      "&": {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transition: "opacity 300ms",
                        opacity: 0,
                        borderRadius: "50%",
                        height: "100%",
                        width: "100%",
                        willChange: "opacity",
                        backgroundColor: (theme) =>
                          hexToRGBA(theme.palette.customColors.backdrop, 0.5),
                        color: (theme) =>
                          theme.palette.customColors.backdropContrastText,
                      },
                      "&:hover": { opacity: 1 },
                    }}>
                    <Icon fontSize="1.35rem" icon={"ic:sharp-add-a-photo"} />
                    <Typography
                      sx={{ lineHeight: 1, color: "inherit" }}
                      variant="body2">
                      Update avatar
                    </Typography>
                  </Stack>
                </UploadImage>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Allowed JPEG, JPG, PNG, or WEBP
              </Typography>
              <Typography variant="body2" color="text.secondary">
                max size of 2 MB.
              </Typography>
            </Stack>
            <Grid container rowSpacing={3} columnSpacing={3}>
              {updateEmployeeField.map((field, index) => (
                <Fragment key={index}>
                  {index === 3 && (
                    <Grid item md={6} xs={12}>
                      <Controller
                        name="groupId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <GroupSelect
                            {...field}
                            required
                            fullWidth
                            label="Group"
                            value={field.value || ""}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState.error?.message}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </Grid>
                  )}

                  {index === 5 && (
                    <Grid item md={6} xs={12}>
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <PhoneInput
                            {...field}
                            ref={field.ref}
                            required
                            fullWidth
                            label="Phone number"
                            placeholder="Enter number phone"
                            value={formatPhoneNumber(field.value || "")}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState.error?.message}
                            onChange={(event) =>
                              field.onChange(
                                formatPhoneNumber(event.target.value),
                              )
                            }
                          />
                        )}
                      />
                    </Grid>
                  )}

                  <RenderFieldsControlled
                    field={field}
                    form={form}
                    id={String(index)}
                    name={field.name as Path<UpdateEmployeeValues>}
                  />
                </Fragment>
              ))}
            </Grid>
          </Box>

          <Stack
            direction="row"
            justifyContent="end"
            spacing={1.5}
            sx={{ mt: "1rem", pt: "1.5rem" }}>
            <Button
              onClick={closeMenu}
              sx={{ width: { xs: "100%", md: "auto" } }}
              color="secondary"
              variant="contained">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              sx={{
                width: { xs: "100%", md: "auto" },
              }}
              variant="contained">
              Update
            </Button>
          </Stack>
        </Stack>
        <IconButton
          disableRipple
          onClick={closeMenu}
          sx={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
          }}>
          <Icon fontSize="1.5rem" icon="si:close-line" />
        </IconButton>
      </Form>
    </PerfectScrollbar>
  );
};
export default EmployeeUpdate;
