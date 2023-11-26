import { Button } from "antd";
import React from "react";

const ButtonComponent = ({ children, size, style, textButton, disabled, ...rests }) => {
  return (
    <Button
      size={size}
      style={{ ...style, background: disabled ? "#ccc" : style?.background }}
      disabled={disabled}
      {...rests}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
