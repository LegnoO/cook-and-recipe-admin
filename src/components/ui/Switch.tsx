// ** Mui Imports
import { keyframes, Switch as MuiSwitch, SwitchProps } from "@mui/material";

const loading = keyframes`
to {
  transform: rotate(1turn)
}
`;
type ColorType =
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

type Props = { color: ColorType } & SwitchProps;

const Switch = ({ color, sx, ...rest }: Props) => {
  return (
    <MuiSwitch
      color={color || "default"}
      sx={{
        "& .MuiSwitch-thumb": {
          opacity: 0.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        "& .Mui-disabled .MuiSwitch-thumb:before": {
          content: '""',
          width: "80%",
          height: "80%",
          padding: "3px",
          aspectRatio: "1",
          borderRadius: "50%",
          background: (theme) => theme.palette[color].main,
          "--_m":
            "conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box",
          mask: "var(--_m)",
          WebkitMask: "var(--_m)",
          maskComposite: "subtract",
          WebkitMaskComposite: "source-out",
          animation: `${loading} 1s infinite linear`,
        },
        ...sx,
      }}
      {...rest}
    />
  );
};

export default Switch;
