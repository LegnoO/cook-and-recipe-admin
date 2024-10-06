// ** React Imports
import { useState, ChangeEvent } from "react";

// ** Mui Imports
import {
  Checkbox,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";

// ** Components
import { PermissionSelect } from "@/components/fields";
import { Icon } from "@/components/ui";
import { compareArrayLengths } from "@/utils/helpers";

const ListGroup = () => {
  const [permissions, setPermissions] = useState<PagePermissions[]>([]);

  const [permissionsSelected, setPermissionsSelected] = useState<
    PagePermissionsSelected[]
  >([]);

  const handlePermissionChange = (
    event: ChangeEvent<HTMLInputElement>,
    child?: JSX.Element,
  ) => {
    const pagePermissionValue = child
      ? (child.props.value as PagePermissions)
      : null;

    const values = event.target.value as unknown as PagePermissions[];

    setPermissions(Array.isArray(values) ? values : [...values]);

    let updatedPermission: Partial<PagePermissionsSelected>;
    if (compareArrayLengths(values, permissions) > 0) {
      updatedPermission = {
        page: pagePermissionValue?.page,
        actions: pagePermissionValue?.actions.map((action) => {
          return {
            name: action,
            checked: action === "read",
          };
        }),
      };
      setPermissionsSelected((prev) => [
        ...prev,
        updatedPermission as PagePermissionsSelected,
      ]);
    } else {
      setPermissionsSelected((prev) =>
        prev.filter((perm) => perm.page !== pagePermissionValue?.page),
      );
    }
  };

  function handleChangeTest(action: PermissionActionObject, page: string) {
    const clonePermissionsSelected = [...permissionsSelected];

    const permission = clonePermissionsSelected.find(
      (permission) => permission.page === page,
    );

    if (permission) {
      const targetAction = permission.actions.find(
        (act) => act.name === action.name,
      );

      if (targetAction) {
        targetAction.checked = !targetAction.checked;
      }

      const indexPermission = clonePermissionsSelected.findIndex(
        (perm) => perm.page === page,
      );
      clonePermissionsSelected[indexPermission] = permission;

      setPermissionsSelected(clonePermissionsSelected);
    }
  }

  const renderPermissionSelected = () => {
    return permissionsSelected.map((x, i) => {
      return (
        <Stack sx={{ width: 300 }} direction="row" spacing={2} key={i}>
          <Accordion
            sx={{ width: "100%" }}
            slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary
              sx={{
                "&": {
                  borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  minHeight: 50,
                  height: 50,
                },
                "&.Mui-expanded": {
                  minHeight: 50,
                  height: 50,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  marginBlock: 0,
                },
              }}
              expandIcon={<Icon icon="ic:sharp-expand-more" />}
              aria-controls="test"
              id="test">
              {x.page}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                paddingInline: "1rem",
                paddingBlock: "0.25rem",
              }}>
              {x.actions.map((y, i) => {
                return (
                  <Stack
                    onClick={() => {
                      y.name !== "read" && handleChangeTest(y, x.page);
                    }}
                    sx={{
                      cursor: "pointer",
                    }}
                    justifyContent="space-between"
                    direction="row"
                    alignItems={"center"}
                    spacing={1}
                    key={i}>
                    <p>{y.name}</p>
                    <Checkbox
                      disabled={y.name === "read"}
                      checked={y.checked}
                    />
                  </Stack>
                );
              })}
            </AccordionDetails>
          </Accordion>
        </Stack>
      );
    });
  };

  return (
    <div>
      ListGroup
      <Grid container rowSpacing={3} columnSpacing={3}>
        <Grid item md={6} xs={12}>
          <PermissionSelect
            fullWidth
            value={permissions}
            onChange={handlePermissionChange}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            {renderPermissionSelected()}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};
export default ListGroup;
