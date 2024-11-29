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
import { updateEmployeeField } from "@/config/fields/update-employee-field";
import { queryOptions } from "@/config/query-options";

// ** Services
import { getEmployeeDetail, updateEmployee } from "@/services/employeeService";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";
import {
  createFormData,
  handleToastMessages,
  hexToRGBA,
} from "@/utils/helpers";

// ** Types
import {
  EmployeeUpdateFormSchema,
  IEmployeeUpdateFormSchema,
} from "@/utils/validations";

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
  const title = "Update Information";
  const { data: employeeData, isLoading: employeeLoading } = useQuery({
    queryKey: ["employee-detail", employeeId],

    queryFn: () => getEmployeeDetail(employeeId),
    ...queryOptions,
  });

  const [avatarFileState, setAvatarFileState] = useState<
    Partial<{ file?: File; url?: string }>
  >({});

  const [isLoading, setLoading] = useState(false);

  const form = useForm<IEmployeeUpdateFormSchema>({
    resolver: zodResolver(EmployeeUpdateFormSchema),
  });

  function handleFileSelect(file?: File, imageDataUrl?: string) {
    const newFileUpdated = { file, url: imageDataUrl };
    if (newFileUpdated) {
      setAvatarFileState(newFileUpdated);
    }
  }

  async function onSubmit(data: IEmployeeUpdateFormSchema) {
    const toastLoading = toast.loading("Loading...");

    const employeeData = {
      fullName: data.fullName,
      groupId: data.group,
      address: JSON.stringify(data.address),
      email: data.email,
      gender: data.gender,
      phone: data.phone,
      avatar: avatarFileState.file,
      dateOfBirth: String(data.dateOfBirth),
    };

    try {
      setLoading(true);
      const formData = createFormData(employeeData);
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
    if (employeeData) {
      let employeeInfo: Partial<IEmployeeUpdateFormSchema> = {};
      const { id, disabledDate, createdDate, status, group, ...rest } =
        employeeData;
      employeeInfo = rest;
      employeeInfo.group = employeeData.group.id;

      form.reset(employeeInfo);
    }
  }, [employeeData]);

  if (employeeLoading) {
    return <ModalLoading title={title} closeMenu={closeMenu} />;
  }

  return (
    <PerfectScrollbar
      options={{ useBothWheelAxes: true, wheelPropagation: false }}>
      <Form
        sx={{ position: "relative", maxHeight: "95dvh" }}
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
            {title}
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
                  alt={`Avatar ${employeeData?.fullName ?? "default"}`}
                  src={avatarFileState?.url || employeeData?.avatar}
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
                      <GroupSelect<IEmployeeUpdateFormSchema>
                        label="Group"
                        fullWidth
                        form={form}
                        name="group"
                        required
                      />
                    </Grid>
                  )}

                  {index === 5 && (
                    <Grid item md={6} xs={12}>
                      <PhoneInput
                        fullWidth
                        label="Phone number"
                        name="phone"
                        placeholder="Enter number phnone"
                        form={form}
                        required
                      />
                    </Grid>
                  )}

                  <RenderFieldsControlled
                    field={field}
                    control={form.control}
                    id={String(index)}
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
