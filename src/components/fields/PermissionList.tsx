// ** React Imports
import { ChangeEvent, Dispatch, SetStateAction, useEffect, memo } from "react";

// ** Mui Imports
import { Typography, Checkbox, Stack, Box, Collapse } from "@mui/material";

// ** Components
import { RenderIf } from "@/components";
import { Icon, TextField } from "@/components/ui";
import SearchInput from "./SearchInput";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";

// ** Config
import { queryOptions } from "@/config/query-options";
import { getPermissions } from "@/services/permissionServices";

// ** Utils
import { hexToRGBA } from "@/utils/helpers";

// ** Types
type Props = {
  setPermissions: Dispatch<SetStateAction<Permissions[]>>;
  permissions: Permissions[];
  permissionDetail?: PermissionsFetch[];
  groupName?: string;
  groupNameError?: string;
  searchPermissions: string;
  isLoading?: boolean;
  handleChangeSearchPermissions: (event: ChangeEvent<HTMLInputElement>) => void;
  handleChangeGroupName: (event: ChangeEvent<HTMLInputElement>) => void;
};

const PermissionList = ({
  isLoading,
  permissions,
  setPermissions,
  groupName,
  handleChangeGroupName,
  searchPermissions,
  handleChangeSearchPermissions,
  permissionDetail,
  groupNameError,
}: Props) => {
  const { data: listPermissions } = useQuery({
    queryKey: ["all-permission"],
    queryFn: getPermissions,
    ...queryOptions,
  });

  const isPermissionSelected = (page: string) =>
    permissions.length > 0
      ? permissions?.find((perm) => perm.page === page)?.checked
      : false;

  function handlePermissionChange(permission: PermissionsFetch) {
    setPermissions((prev) =>
      prev.map((perm) => ({
        ...perm,
        checked:
          perm.page !== "read" && perm.page === permission.page
            ? !perm.checked
            : perm.checked,
        actions: !perm.checked
          ? perm.actions.map((act) => ({
              ...act,
              checked: act.name === "read",
            }))
          : perm.actions,
      })),
    );
  }

  function handlePermissionSelected(
    page: string,
    action: PermissionActionObject,
  ) {
    setPermissions((prev) =>
      prev.map((perm) => ({
        ...perm,
        actions:
          perm.page === page
            ? perm.actions.map((act) => ({
                ...act,
                checked: act.name === action.name ? !act.checked : act.checked,
              }))
            : perm.actions,
      })),
    );
  }

  useEffect(() => {
    if (
      !isLoading &&
      listPermissions &&
      listPermissions.length > 0 &&
      permissions.length === 0
    ) {
      let updatedPermission = listPermissions.map((permission) => {
        const detail = permissionDetail?.find(
          (detail) => detail.page === permission.page,
        );

        return {
          page: permission.page,
          checked: Boolean(detail?.page),
          actions: permission.actions.map((action) => {
            const actionChecked = detail?.actions.includes(action);
            return {
              name: action,
              checked: action === "read" || actionChecked,
            };
          }),
        };
      }) as Permissions[];

      setPermissions(updatedPermission);
    }
  }, [listPermissions, permissionDetail]);

  return (
    <RenderIf condition={Boolean(listPermissions)}>
      <Stack
        sx={{ width: "100%", paddingRight: "0.75rem" }}
        direction="column"
        spacing={1.5}>
        <RenderIf condition={Boolean(groupName)}>
          <TextField
            defaultValue={groupName}
            fullWidth
            placeholder="Enter Group Name"
            label="Group Name"
            error={Boolean(groupNameError)}
            helperText={groupNameError}
            onChange={handleChangeGroupName}
          />
        </RenderIf>

        <Stack
          sx={{
            borderRadius: (theme) => `${theme.shape.borderRadius}px`,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            p: 2.5,
          }}
          direction="column"
          spacing={1.5}>
          <SearchInput
            fullWidth
            onChange={handleChangeSearchPermissions}
            placeholder="Search Permission"
            // disabled={isLoading}
          />
          {listPermissions
            ?.filter((permission) =>
              permission.page.includes(searchPermissions),
            )
            .map((permission, index) => (
              <Stack
                key={index}
                sx={{
                  borderRadius: (theme) => `${theme.shape.borderRadius - 2}px`,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  width: 400,
                }}
                direction="column"
                spacing={1}>
                <Stack
                  sx={{
                    "&": {
                      borderBottom: (theme) =>
                        `${
                          isPermissionSelected(permission.page) ? 0 : 1
                        }px solid ${theme.palette.divider}`,
                      backgroundColor: (theme) =>
                        hexToRGBA(theme.palette.background.paper, 1, 15),
                      paddingBlock: 0,
                      paddingInline: "0.5rem",
                      minHeight: 45,
                      gap: 0.5,
                      cursor: "pointer",
                      transition:
                        "background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                    },
                    "&:hover": {
                      backgroundColor: (theme) =>
                        hexToRGBA(theme.palette.background.paper, 1, 10),
                    },
                  }}
                  direction="row"
                  alignItems={"center"}
                  onClick={() => handlePermissionChange(permission)}>
                  <Checkbox
                    checked={isPermissionSelected(permission.page) || false}
                    disableRipple
                  />
                  <Typography
                    fontWeight={400}
                    variant="subtitle2"
                    color="text.primary">
                    {permission.page}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignitems: "center",
                      transition:
                        "transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                      marginLeft: "auto",
                      transform:
                        permissions.length > 0 &&
                        Boolean(
                          permissions.find(
                            (perm) => perm.page === permission.page,
                          ),
                        )
                          ? "rotate(0deg)"
                          : "rotate(180deg)",
                    }}>
                    <Icon fontSize="1.125rem" icon={"ic:sharp-expand-more"} />
                  </Box>
                </Stack>
                <Collapse
                  sx={{ marginTop: "0 !important" }}
                  in={isPermissionSelected(permission.page) || false}>
                  <Stack
                    sx={{ paddingBlock: "0.5rem", paddingLeft: "0.75rem" }}
                    direction="column"
                    spacing={1}>
                    <RenderIf condition={Boolean(permissions.length > 0)}>
                      {permissions
                        ?.find((perm) => perm.page === permission.page)
                        ?.actions.map((action, index) => (
                          <Stack
                            key={index}
                            sx={{
                              paddingBlock: 0,
                              paddingInline: "0.5rem",
                            }}
                            direction="row"
                            alignItems={"center"}
                            spacing={0.5}>
                            <Checkbox
                              onClick={() =>
                                handlePermissionSelected(
                                  permission.page,
                                  action,
                                )
                              }
                              checked={action.checked || false}
                              disabled={action.name === "read"}
                              disableRipple
                            />
                            <Typography
                              fontWeight={400}
                              variant="subtitle2"
                              color="text.primary">
                              {action.name}
                            </Typography>
                          </Stack>
                        ))}
                    </RenderIf>
                  </Stack>
                </Collapse>
              </Stack>
            ))}
        </Stack>
      </Stack>
    </RenderIf>
  );
};

export default memo(PermissionList);
