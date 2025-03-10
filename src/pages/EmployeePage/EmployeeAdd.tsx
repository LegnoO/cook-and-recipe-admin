// ** React Imports
import { useState, Fragment, memo, Dispatch, SetStateAction } from "react";

// ** Mui Imports
import {
  Grid,
  Typography,
  Button,
  Stack,
  Input,
  IconButton,
} from "@mui/material";

// ** Components
import { GroupSelect, PhoneInput } from "@/components/fields";
import { Form, Icon } from "@/components/ui";
import { UploadImage, RenderFieldsControlled } from "@/components";

// ** Library Imports
import { useForm, Path, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Utils
import { formatPhoneNumber } from "@/utils/helpers";
import { handleAxiosError } from "@/utils/errorHandler";
import { createFormData, handleToastMessages } from "@/utils/helpers";

// ** Schemas
import {
  addEmployeeSchema,
  AddEmployeeValues,
} from "@/schemas/addEmployeeSchema";

// ** Services
import { createEmployee } from "@/services/employeeService";

// ** Types
type Props = {
  setController: Dispatch<SetStateAction<AbortController | null>>;
  closeMenu: () => void;
  refetch: () => void;
};

const EmployeeAdd = ({ refetch, closeMenu, setController }: Props) => {
  const addEmployeeField: FormField[] = [
    {
      name: "fullName",
      label: "Full name",
      placeholder: "Enter full name",
      type: "input",
      required: true,
      size: { md: 6 },
    },

    {
      name: "email",
      label: "Email",
      placeholder: "Enter email",
      type: "input",
      required: true,
      size: { md: 6 },
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter password",
      type: "input",
      required: true,
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
          label: "Number address",
          placeholder: "Enter number",
          type: "input",
          required: true,
          size: { md: 6 },
        },

        {
          name: "address.street",
          label: "Street address",
          placeholder: "Enter street address",
          type: "input",
          required: true,
          size: { md: 6 },
        },
        {
          name: "address.ward",
          label: "Ward address",
          placeholder: "Enter ward address",
          type: "input",
          required: true,
          size: { md: 6 },
        },
        {
          name: "address.district",
          label: "District address",
          placeholder: "Enter district address",
          type: "input",
          required: true,
          size: { md: 6 },
        },
        {
          name: "address.city",
          label: "City address",
          placeholder: "Enter city address",
          type: "input",
          required: true,
          size: { md: 6 },
        },
      ],
    },
  ];

  const [isLoading, setLoading] = useState(false);

  const form = useForm<AddEmployeeValues>({
    resolver: zodResolver(addEmployeeSchema),
  });

  const avatar = form.watch("avatar");

  async function handleFileSelect(file?: File, _imageDataUrl?: string) {
    form.setValue("avatar", file);
  }

  async function onSubmit(data: AddEmployeeValues) {
    const toastLoading = toast.loading("Loading...");

    const employeeData = {
      groupId: data.groupId,
      address: JSON.stringify(data.address),
      gender: data.gender,
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      avatar,
    };

    try {
      setLoading(true);
      const formData = createFormData(employeeData);
      const newController = new AbortController();
      setController(newController);
      await createEmployee(formData, newController);
      toast.success("Add new employee successfully");
      refetch();
      setController(null);
      closeMenu();
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      handleToastMessages(toast.error)(errorMessage);
    } finally {
      toast.dismiss(toastLoading);
      setLoading(false);
    }
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
            Add New Employee
          </Typography>
          <Grid container rowSpacing={3} columnSpacing={3}>
            {addEmployeeField.map((field, index) => (
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
                          value={field.value || ""}
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
                  name={field.name as Path<AddEmployeeValues>}
                />
              </Fragment>
            ))}
            <Grid item md={6} xs={12}>
              <Typography
                sx={{ mb: 0.25, color: (theme) => theme.palette.text.primary }}
                variant="h6">
                Upload avatar
              </Typography>

              <Stack
                sx={{
                  borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
                direction="row"
                alignItems="center"
                spacing={0}>
                <UploadImage
                  name="avatar"
                  disabled={isLoading}
                  sx={{
                    borderRadius: "inherit 0 0 inherit",
                    minWidth: 125,
                    maxWidth: 220,
                    fontWeight: 500,
                  }}
                  onFileSelect={handleFileSelect}>
                  Choose File
                </UploadImage>
                <Input
                  disableUnderline
                  sx={{
                    paddingBlock: 0,
                    paddingInline: "0.5rem",
                    backgroundColor: "transparent",
                    border: "1px solid transparent",
                    outline: "none",
                  }}
                  value={avatar?.name || "No file chosen"}
                />
              </Stack>
            </Grid>
          </Grid>
          <Stack
            direction="row"
            justifyContent="end"
            spacing={1.5}
            sx={{ width: "100%", mt: "1rem", pt: "1.5rem" }}>
            <Button
              disableRipple
              onClick={closeMenu}
              sx={{ width: { xs: "100%", md: "auto" } }}
              color="secondary"
              variant="contained">
              Cancel
            </Button>
            <Button
              disableRipple
              disabled={isLoading}
              type="submit"
              sx={{
                width: { xs: "100%", md: "auto" },
              }}
              variant="contained">
              Submit
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
export default memo(EmployeeAdd);
