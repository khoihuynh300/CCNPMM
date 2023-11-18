import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    bordered,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(13, 92, 182)",
    colorButton = "#fff",
  } = props;

  return (
    <div style={{ display: "flex" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{ background: backgroundColorInput, borderRadius: "0" }}
      />
      <ButtonComponent
        size={size}
        icon={<SearchOutlined />}
        style={{
          borderRadius: 0,
          border: !bordered && "none",
          background: backgroundColorButton,
          color: colorButton,
        }}
      >
        {textButton}
      </ButtonComponent>
    </div>
  );
};

export default ButtonInputSearch;
