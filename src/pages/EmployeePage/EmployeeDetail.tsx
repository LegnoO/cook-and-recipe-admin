// ** Mui Imports
import {
  Grid,
  Typography,
  Stack,
  Avatar,
  Box,
  IconButton,
  Button,
} from "@mui/material";

// ** Components
import { Icon, ModalLoading } from "@/components/ui";

// ** Library Imports
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { getEmployeeDetail } from "@/services/employeeService";

// ** Types
type Props = {
  employeeId: string;
  closeMenu: () => void;
};

const EmployeeDetail = ({ employeeId, closeMenu }: Props) => {
  const title = "Employee Information";

  const navigate = useNavigate();
  const { data: employeeData, isLoading } = useQuery({
    queryKey: ["employee-detail", employeeId],
    queryFn: () => getEmployeeDetail(employeeId),
    ...queryOptions,
  });

  const InfoGroup = ({
    title,
    icon,
    value,
  }: {
    icon?: string;
    title: string;
    value: string;
  }) => {
    return (
      <Box sx={{}}>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
            fontWeight: 500,
            mb: "0.25rem",
          }}>
          {title}
        </Typography>
        <Stack
          sx={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          {icon && <Icon fontSize="1.25rem" icon={icon} />}
          <Typography
            component="span"
            sx={{ fontSize: "1rem", fontWeight: 500 }}>
            {value}
          </Typography>
        </Stack>
      </Box>
    );
  };

  if (isLoading) {
    return <ModalLoading title={title} closeMenu={closeMenu} />;
  }

  if (!isLoading && !employeeData) {
    navigate("/error");
  }

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        padding: "1.5rem",
        width: "100%",
      }}>
      <Stack
        sx={{
          marginBottom: "2rem",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}>
        <Typography
          sx={{ width: "100%" }}
          fontWeight={500}
          component="h2"
          variant="h4">
          {title}
        </Typography>
        <IconButton
          disableRipple
          onClick={closeMenu}
          sx={{
            p: 0,
          }}>
          <Icon fontSize="1.5rem" icon="si:close-line" />
        </IconButton>
      </Stack>

      <PerfectScrollbar
        options={{ useBothWheelAxes: true, wheelPropagation: false }}>
        <Stack sx={{ height: "65dvh", flexDirection: "column" }}>
          <Stack
            sx={{
              alignItems: "center",
              marginBottom: "2.5rem",
            }}>
            <Avatar
              alt={`Avatar ${employeeData!.fullName ?? "default"}`}
              src={employeeData!.avatar}
              sx={{ height: "120px", width: "120px" }}
            />
          </Stack>
          <Grid container rowSpacing="1rem" columnSpacing="1rem">
            <Grid item md={6} xs={12}>
              <InfoGroup
                title="Full Name"
                icon="mage:user"
                value={employeeData!.fullName}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup
                title="User Name"
                icon="mage:user"
                value={employeeData!.username}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup title="Email" value={employeeData!.email} />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup title="Group" value={employeeData!.group.name} />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup title="Gender" value={employeeData!.gender || ""} />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup title="Phone" value={employeeData!.phone || ""} />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup
                title="City"
                value={employeeData!.address.city || ""}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup
                title="District"
                value={employeeData!.address.district || ""}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup
                title="Number"
                value={employeeData!.address.number || ""}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup
                title="Street"
                value={employeeData!.address.street || ""}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InfoGroup
                title="Ward"
                value={employeeData!.address.ward || ""}
              />
            </Grid>
          </Grid>
        </Stack>
      </PerfectScrollbar>

      <Stack
        sx={{
          alignItems: "end",
          marginTop: "2rem",
        }}>
        <Button
          onClick={closeMenu}
          sx={{
            backgroundColor: (theme) => theme.palette.secondary.main,
          }}
          variant="contained">
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default EmployeeDetail;
