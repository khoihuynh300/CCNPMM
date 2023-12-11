import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigatetype = () => {
    navigate(
      `/category/${name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`
    );
  };

  return (
    <div style={{ cursor: "pointer" }} onClick={handleNavigatetype}>
      {name}
    </div>
  );
};

export default TypeProduct;
