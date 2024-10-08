// ** React Imports
import { useState, Fragment, memo, Dispatch, SetStateAction } from "react";

// ** Mui Imports
import { Grid, Typography, Button, Stack, Input } from "@mui/material";

// ** Components
import { GroupSelect, PhoneInput } from "@/components/fields";
import { Form } from "@/components/ui";
import { RenderIf, UploadImage, RenderFieldsControlled } from "@/components";

// ** Library Imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Config
import { addEmployeeField } from "@/config/fields/add-employee-field";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";
import { AddEmployeeSchema } from "@/utils/validations";
import { createFormData } from "@/utils/helpers";

// ** Services
import { addEmployee } from "@/services/userService";

// ** Types
type Props = {
  setController: Dispatch<SetStateAction<AbortController | null>>;
  closeMenu: () => void;
  refetch: () => void;
};

const AddEmployee = ({ refetch, closeMenu, setController }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(AddEmployeeSchema),
  });

  function handleFileSelect(file?: File, _imageDataUrl?: string) {
    if (file) setFile(file);
  }

  async function onSubmit(data: any) {
    const toastLoading = toast.loading("Loading...");

    const employeeData = {
      groupId: data.groupId,
      address: JSON.stringify(data.address),
      gender: data.gender,
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth || undefined,
      avatar: file || undefined,
    };

    try {
      setLoading(true);
      const formData = createFormData(employeeData);
      const newController = new AbortController();
      setController(newController);
      await addEmployee(formData, newController);
      toast.success("Add new employee successfully");
      refetch();
      setLoading(false);
      setController(null);
      closeMenu();
    } catch (error) {
      handleAxiosError(error);
      toast.dismiss(toastLoading);
    }
  }

  return (
    <PerfectScrollbar
      options={{ useBothWheelAxes: true, wheelPropagation: false }}>
      <Form
        sx={{
          maxHeight: "95dvh",
        }}
        noValidate
        onSubmit={handleSubmit(onSubmit)}>
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
            sx={{ mb: "2.75rem" }}
            variant="h4">
            Add New Employee
          </Typography>
          <Grid container rowSpacing={3} columnSpacing={3}>
            {addEmployeeField.map((field, index) => (
              <Fragment key={index}>
                <RenderIf condition={index === 3}>
                  <Grid item md={6} xs={12}>
                    <GroupSelect
                      label="Group"
                      fullWidth
                      control={control}
                      name="groupId"
                      required
                    />
                  </Grid>
                </RenderIf>
                <RenderIf condition={index === 5}>
                  <Grid item md={6} xs={12}>
                    <PhoneInput
                      fullWidth
                      label="Phone number"
                      name="phone"
                      placeholder="Enter number phnone"
                      control={control}
                      required
                    />
                  </Grid>
                </RenderIf>

                <RenderFieldsControlled
                  field={field}
                  control={control}
                  id={String(index)}
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
                  value={file?.name || "No file chosen"}
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
              Submit
            </Button>
          </Stack>
        </Stack>
      </Form>
    </PerfectScrollbar>
  );
};
export default memo(AddEmployee);
