// ** React Imports
import { useEffect, Fragment } from "react";

// ** Mui Imports
import { Grid, Typography, Button, Stack } from "@mui/material";

// ** Components
import Fields from "@/components/Fields";
import { Form } from "@/components/ui";

// ** Library
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

// ** Config
import { updateEmployeeField } from "@/config/fields/update-employee-field";

// ** Utils
import { updateEmployeeData } from "@/utils/services/userService";
import { handleAxiosError } from "@/utils/errorHandler";
import { EmployeeDetailFormSchema } from "@/utils/validations";

// ** Types
import { IEmployeeDetailFormSchema } from "@/types/schemas";

type Props = {
  employeeData: any;
  closeMenu: () => void;
};

const UpdateEmployee = ({ employeeData, closeMenu }: Props) => {
  const { mutate } = useMutation({
    mutationFn: (employeeData: any) => updateEmployeeData(employeeData),
    onSuccess: async (test) => {
      console.log("🚀 ~ onSuccess: ~ test:", test);
    },
    onError: (error) => {
      handleAxiosError(error);
    },
  });

  const { reset, control, handleSubmit } = useForm<IEmployeeDetailFormSchema>({
    resolver: zodResolver(EmployeeDetailFormSchema),
  });

  async function onSubmit(data: IEmployeeDetailFormSchema) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    mutate(data);
  }

  useEffect(() => {
    if (employeeData) {
      const { ...employeeDataRest } = employeeData;
      const updatedValues = {
        test: { label: "abc test", value: "ezx" },
        ...employeeDataRest,
      };
      console.log("🚀 ~ useEffect ~ updatedValues:", updatedValues);
      reset(updatedValues);
    }
  }, [employeeData]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        fontWeight={500}
        component="h3"
        sx={{ mb: "1.5rem" }}
        variant="h4">
        Update Information
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {updateEmployeeField.map((field, index) => (
          <Fragment key={index}>
            <Fields field={field} control={control} />
          </Fragment>
        ))}
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
          Update
        </Button>
      </Stack>
    </Form>
  );
};
export default UpdateEmployee;
