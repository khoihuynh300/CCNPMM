import React from "react";

import { WrapperInputStyle } from "./style";

const InputForm = (props) => {
  const { placeholder = "Nhập text", style, type, value, onChange, disabled=false } = props;
  return (
    <WrapperInputStyle
      style={style}
      placeholder={placeholder}
      value={value}
      type={type}
      onChange={onChange}
      disabled = {disabled}
    />
  );
};

export default InputForm;
