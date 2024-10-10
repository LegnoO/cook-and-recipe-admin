// ** React Imports
import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";

// ** Mui Imports
import { Typography, Button, Stack } from "@mui/material";

// ** Library Imports
import { toast } from "react-toastify";

// ** Utils
import { handleAxiosError } from "@/utils/errorHandler";

// ** Components
import { Form } from "@/components/ui";
import { GroupSelect } from "@/components/fields";

// ** Services
import { updateGroupAllEmployees } from "@/services/employeeService";

// ** Types
type Props = {
  group: Group;
  closeMenu: () => void;
  setController: Dispatch<SetStateAction<AbortController | null>>;
  refetch: () => void;
};

const MoveMember = ({ group, setController, closeMenu, refetch }: Props) => {
  const [groupId, setGroupId] = useState(group.id);
  const [isLoading, setLoading] = useState(false);

  function handleChangeGroupName(event: ChangeEvent<HTMLInputElement>) {
    setGroupId(event.target.value);
  }

  async function onSubmit() {
    const toastLoading = toast.loading("Loading...");
    const data = {
      currentGroup: group.id,
      newGroup: groupId,
    };
    try {
      setLoading(true);
      const newController = new AbortController();
      setController(newController);
      await updateGroupAllEmployees(data, newController);
      toast.success("Updated group successfully");
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
    <Form noValidate>
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
            Move all member to another Group
          </Typography>
        </Stack>
        <GroupSelect
          disabled={isLoading}
          onChange={handleChangeGroupName}
          value={groupId}
          fullWidth
          label="Group"
        />
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
  );
};
export default MoveMember;
