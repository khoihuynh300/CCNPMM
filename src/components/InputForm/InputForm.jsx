import React from "react";

import { WrapperInputStyle } from "./style";

const InputForm = (props) => {
  const { placeholder = "Nhập text", style, type, value, onChange } = props;
  return (
    <WrapperInputStyle
      style={style}
      placeholder={placeholder}
      value={value}
      type={type}
      onChange={onChange}
    />
  );
};

export default InputForm;
