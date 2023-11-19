import React, { useState } from "react";

import { WrapperInputStyle } from "./style";

const InputForm = (props) => {
  const [valueInput, setValueInput] = useState("");
  const { placeholder = "Nhập text", style, type } = props;
  return (
    <WrapperInputStyle
      style={style}
      placeholder={placeholder}
      valueInput={valueInput}
      type={type}
    />
  );
};

export default InputForm;
