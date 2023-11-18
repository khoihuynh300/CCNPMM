import { Button } from "antd";
import React from "react";

const ButtonComponent = ({ children, size, style, textButton, ...rests }) => {
  return (
    <Button size={size} style={style} {...rests}>
      {children}
    </Button>
  );
};

export default ButtonComponent;
