// ** Library
import { Icon, IconProps } from "@iconify/react";

const IconifyIcon = ({ icon, ...rest }: IconProps) => {
  return (
    <Icon
      style={{ height: "22px", width: "22px" }}
      icon={icon}
      fontSize="1.375rem"
      {...rest}
    />
  );
};

export default IconifyIcon;
