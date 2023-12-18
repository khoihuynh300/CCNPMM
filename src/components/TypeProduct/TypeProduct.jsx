import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ name, slug }) => {
  const navigate = useNavigate();
  const handleNavigatetype = () => {
    navigate(
      `/category/${slug}`
    );
  };

  return (
    <div style={{ cursor: "pointer" }} onClick={handleNavigatetype}>
      {name}
    </div>
  );
};

export default TypeProduct;
