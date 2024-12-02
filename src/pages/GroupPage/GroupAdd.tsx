// ** React Imports
import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";

// ** Mui Imports
import { Typography, Button, Stack, Box } from "@mui/material";

// ** Library Imports
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";

// ** Components
import PermissionList from "@/components/fields/PermissionList";
import { Form } from "@/components/ui";
import { createGroup } from "@/services/groupServices";

// ** Types
type Props = {
  closeMenu: () => void;
  setController: Dispatch<SetStateAction<AbortController | null>>;

  refetch: () => void;
};

const GroupAdd = ({ setController, closeMenu, refetch }: Props) => {
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [groupNameError, setGroupNameError] = useState<string>("");
  const [searchPermissions, setSearchPermissions] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  const handleChangeGroupName = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setGroupName(event.target.value);
      setGroupNameError("");
    },
    300,
  );

  const handleChangeSearchPermissions = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchPermissions(event.target.value);
    },
    300,
  );

  async function onSubmit() {
    if (groupName === "") {
      setGroupNameError("Group name should not be empty");
      return;
    }
    const toastLoading = toast.loading("Loading...");

    const group = {
      name: groupName,
      permissions: [...permissions]
        .map((permission) =>
          permission.checked
            ? {
                page: permission.page,
                actions: permission.actions
                  .map((action) => (action.checked ? action.name : undefined))
                  .filter(Boolean),
              }
            : undefined,
        )
        .filter(Boolean),
    } as GroupSubmit;

    try {
      setLoading(true);
      const newController = new AbortController();
      setController(newController);
      await createGroup(group, newController);
      toast.success("Created group successfully");
      refetch();
      setLoading(false);
      setController(null);
      closeMenu();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      toast.dismiss(toastLoading);
    }
  }

  return (
    <PerfectScrollbar options={{ wheelPropagation: false }}>
      <Form sx={{ maxHeight: "95dvh" }} noValidate>
        <Stack
          sx={{
            borderRadius: "inherit",
            backgroundColor: (theme) => theme.palette.background.paper,
            height: "auto",
            padding: "1.5rem",
          }}
          direction={"column"}
          alignItems={"center"}>
          <Stack
            sx={{ width: "100%", mb: "2.5rem" }}
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}>
            <Typography fontWeight={500} component="h3" variant="h4">
              Create Group
            </Typography>
          </Stack>
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            <Box sx={{ maxHeight: "68dvh", flex: 1 }}>
              <PermissionList
                permissions={permissions}
                setPermissions={setPermissions}
                groupNameError={groupNameError}
                searchPermissions={searchPermissions}
                handleChangeSearchPermissions={handleChangeSearchPermissions}
                handleChangeGroupName={handleChangeGroupName}
              />
            </Box>
          </PerfectScrollbar>
          <Stack
            direction="row"
            justifyContent="end"
            spacing={1.5}
            sx={{
              width: "100%",
              marginTop: "auto",
              paddingTop: "1.5rem",
              paddingRight: "0.75rem",
            }}>
            <Button
              onClick={closeMenu}
              sx={{ width: { xs: "100%", md: "auto" } }}
              color="secondary"
              variant="contained">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onSubmit}
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
export default GroupAdd;
