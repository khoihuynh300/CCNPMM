import React from "react";
import { WrapperLabelText, WrapperTextValue, WrapperContent } from "./style";
import { Checkbox } from "antd";

const NavBarComponent = () => {
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option, index) => {
          return <WrapperTextValue key={index}>{option}</WrapperTextValue>;
        });
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={() => {}}
          >
            {options.map((option) => {
              return <Checkbox value={option.value}>{option.label}</Checkbox>;
            })}
          </Checkbox.Group>
        );
      case "price":
        return options.map((option) => {
          return (
            <div
              style={{
                borderRadius: "50px",
                backgroundColor: "#efefef",
                width: "fit-content",
                padding: "6px 20px",
              }}
            >
              {option}
            </div>
          );
        });
      default:
        return <></>;
    }
  };
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <WrapperLabelText>Label</WrapperLabelText>
      <WrapperContent>
        {renderContent("text", ["TV", "Tủ lạnh", "Laptop"])}
      </WrapperContent>
      {/* <WrapperContent>
        {renderContent("checkbox", [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ])}
      </WrapperContent>

      <WrapperContent>
        {renderContent("price", ["Dưới 1tr", "Trên 1tr"])}
      </WrapperContent> */}
    </div>
  );
};

export default NavBarComponent;
