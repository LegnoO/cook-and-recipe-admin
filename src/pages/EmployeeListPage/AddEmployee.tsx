// ** React Imports
import { useState, Fragment, memo, Dispatch, SetStateAction } from "react";

// ** Mui Imports
import { Grid, Typography, Button, Stack, Input } from "@mui/material";

// ** Components
import GroupSelect from "@/components/fields/GroupSelect";
import UploadImageButton from "@/components/UploadImageButton";
import Fields from "@/components/RenderFieldsControlled";
import { Form } from "@/components/ui";
import RenderIf from "@/components/RenderIf";

// ** Library Imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** Config
import { addEmployeeField } from "@/config/fields/add-employee-field";

// ** Utils
import { addEmployee } from "@/services/userService";
import { handleAxiosError } from "@/utils/errorHandler";
import { AddEmployeeSchema } from "@/utils/validations";
import PhoneInput from "@/components/fields/PhoneInput";
import { toast } from "react-toastify";

// ** Services

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

  function handleFileSelect(file: File | null) {
    if (file) setFile(file);
  }

  async function onSubmit(data: any) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    const toastLoading = toast.loading("Loading...");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("groupId", data.groupId);
      formData.append("address", JSON.stringify(data.address));
      formData.append("gender", data.gender);
      formData.append("email", data.email);
      formData.append("fullName", data.fullName);
      formData.append("password", data.password);
      formData.append("phone", data.phone);
      if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
      if (file) formData.append("avatar", file);

      const newController = new AbortController();
      setController(newController);
      await addEmployee(formData, newController);
      toast.success("Add new employee successfully");
      refetch();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  }

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Typography
        fontWeight={500}
        component="h3"
        sx={{ mb: "2rem" }}
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

            <Fields field={field} control={control} id={String(index)} />
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
            <UploadImageButton
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
            </UploadImageButton>
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
          Add
        </Button>
      </Stack>
    </Form>
  );
};
export default memo(AddEmployee);
