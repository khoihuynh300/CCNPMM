import React from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperTypeProduct } from "./style";
import CardComponent from "../../components/CardComponent/CardComponent";

const HomePage = () => {
  const arr = ["TV", "Tu lanh", "Laptop"];
  return (
    <>
      <div style={{ padding: "0 120px" }}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div
        id="container"
        style={{
          background: "#efefef",
          padding: "10px 120px",
          height: "1000px",
        }}
      >
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            // alignItems: "center",
            gap: "20px",
          }}
        >
          <CardComponent />
        </div>
      </div>
    </>
  );
};

export default HomePage;
