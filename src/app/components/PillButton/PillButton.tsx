import { Button, ButtonProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface PillButtonProps extends ButtonProps {
  children: ReactNode | string;
  styleType?: "primary" | "secondary";
}

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  styleType,
  ...rest
}) => {
  if (styleType === "primary")
    return (
      <Button
        borderRadius="30px"
        _hover={{ backgroundColor: "lightgray" }}
        {...rest}
      >
        {children}
      </Button>
    );

  if (styleType === "secondary")
    return (
      <Button
        borderRadius="30px"
        backgroundColor="transparent"
        border="2px solid white"
        color="white"
        transition="0.3s"
        _hover={{ color: "black", backgroundColor: "white" }}
        {...rest}
      >
        {children}
      </Button>
    );

  return (
    <Button borderRadius="30px" {...rest}>
      {children}
    </Button>
  );
};
