import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    inputValue = "",
    size,
    placeholder,
    textButton,
    bordered,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(13, 92, 182)",
    colorButton = "#fff",
    onKeyDown = ()=>{},
    onClickButton = () => {},
    ...rests
  } = props;

  return (
    <div style={{ display: "flex", borderRadius:"5px", overflow:"hidden" }}>
      <InputComponent
        value={inputValue}
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{ background: backgroundColorInput, borderRadius: "0" }}
        onKeyDown={onKeyDown}
        {...rests}
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
        onClick={onClickButton}
      >
        {textButton}
      </ButtonComponent>
    </div>
  );
};

export default ButtonInputSearch;
