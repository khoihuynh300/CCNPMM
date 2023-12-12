import React, { useEffect, useState } from "react";

import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonHover, WrapperTypeProduct } from "./style";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as productService from "../../services/productService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [typeProduct, setTypeProduct] = useState([]);

  const searchProduct = useSelector((state) => state.product?.search);

  const navigate = useNavigate();

  const fetchProduct = async (search) => {
    const res = await productService.getAllProduct(search);
    setProducts(res.data);
    return res;
  };
  const fetchTypeProduct = async () => {
    const res = await productService.getAllTypeProduct();
    setTypeProduct(res?.data);
  };

  useEffect(() => {
    fetchProduct(searchProduct);
  }, [searchProduct]);

  useEffect(() => {
    fetchTypeProduct();
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProduct,
    retry: 3,
    retryDelay: 1000,
  });

  const handleNavigateProductDetail = (id) => {
    navigate(`/product-detail/${id}`);
  };

  return (
    <>
      <div style={{ padding: "60px 120px 0" }}>
        <WrapperTypeProduct>
          {typeProduct.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div
        id="container"
        style={{
          background: "#efefef",
          padding: "10px 120px",
          // height: "1000px",
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
          {products?.map((product, id) => {
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
                onClick={() => {
                  handleNavigateProductDetail(product._id);
                }}
              />
            );
          })}
        </div>
        {/* <div
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
        </div> */}
      </div>
    </>
  );
};

export default HomePage;
