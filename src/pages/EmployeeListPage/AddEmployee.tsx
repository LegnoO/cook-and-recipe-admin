// ** React Imports
import { useState, Fragment, memo } from "react";

// ** Mui Imports
import { Grid, Typography, Button, Stack, Input } from "@mui/material";

// ** Components
import GroupSelect from "@/components/fields/GroupSelect";
import UploadImageButton from "@/components/UploadImageButton";
import Fields from "@/components/RenderFieldsControlled";
import { Form } from "@/components/ui";
import RenderIf from "@/components/RenderIf";

// ** Library
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** Config
import { addEmployeeField } from "@/config/fields/add-employee-field";

// ** Utils
import { addEmployee } from "@/services/userService";
import { handleAxiosError } from "@/utils/errorHandler";
import { AddEmployeeSchema } from "@/utils/validations";
import PhoneInput from "@/components/fields/PhoneInput";

// ** Services

// ** Types
type Props = {
  closeMenu: () => void;
};

const AddEmployee = ({ closeMenu }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(AddEmployeeSchema),
  });

  function handleFileSelect(file: File | null) {
    if (file) setFile(file);
  }

  async function onSubmit(data: any) {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "address" && value) {
          formData.append(key, JSON.stringify(value));
        }
        formData.append(key, value as string);
      });

      if (file) {
        formData.append("avatar", file);
      }

      const res = await addEmployee(formData);

      console.log("🚀 ~ onSubmit ~ res:", res);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        fontWeight={500}
        component="h3"
        sx={{ mb: "1.5rem" }}
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
