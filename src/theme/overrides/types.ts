// ** MUI Imports
import { Theme } from "@mui/material/styles";
import { ComponentsPropsList } from "@mui/material";

export type OwnerStateThemeType = {
  theme: Theme;
  ownerState: ComponentsPropsList[keyof ComponentsPropsList] &
    Record<string, unknown>;
};