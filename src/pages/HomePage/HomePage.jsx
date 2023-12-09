import React from "react";

import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonHover, WrapperTypeProduct } from "./style";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as productService from "../../services/productService";
import { useQuery } from "@tanstack/react-query";
const HomePage = () => {
  const arr = ["TV", "Tu lanh", "Laptop"];
  const fetchProduct = async () => {
    const res = await productService.getAllProduct();
    return res;
  };
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchProduct,
    retry: 3,
    retryDelay: 1000,
  });
  console.log("data", products);
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
        {/* <NavBarComponent /> */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexWrap: "wrap",
            // alignItems: "center",
            gap: "10px",
          }}
        >
          {products?.data.map((product, id) => {
            return (
              <CardComponent
                key={id}
                countInStock={product.countInStock}
                discount={product.discount}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                selled={product.selled}
              />
            );
          })}
          {/* <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent /> */}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <WrapperButtonHover
            style={{
              border: "1px solid rgb(11, 116, 229)",
              color: "rgb(11, 116, 229)",
              width: "240px",
              height: "38px",
              borderRadius: "4px",
            }}
          >
            Xem thêm
          </WrapperButtonHover>
        </div>
      </div>
    </>
  );
};

export default HomePage;
