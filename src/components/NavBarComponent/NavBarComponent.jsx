import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";

import { WrapperLabelText, WrapperTextValue, WrapperContent } from "./style";
import * as categoryService from "../../services/categoryService";
import { useNavigate } from "react-router-dom";

const NavBarComponent = () => {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate();

  const fetchCategories = async () => {
    const res = await categoryService.getAllCategory();
    setCategories(res?.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNavigatetype = (slug) => {
    navigate(
      `/category/${slug}`
    );
  };

  const renderContent = (type, options) => {
    switch (type) {
      case "category":
        return options.map((option, index) => {
          return (
            <WrapperTextValue
              key={index}
              onClick={() => {
                handleNavigatetype(option.slug);
              }}
            >
              {option.name}
            </WrapperTextValue>
          );
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
      <WrapperLabelText>Danh mục</WrapperLabelText>
      <WrapperContent>{renderContent("category", categories)}</WrapperContent>
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
