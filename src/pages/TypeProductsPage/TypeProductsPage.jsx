import { Col, Pagination, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import NavBarComponent from "../../components/NavBarComponent/NavBarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as productService from "../../services/productService";

const TypeProductsPage = () => {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const params = useParams();
  const type = params.type;

  const fetchProductOfType = async () => {
    const res = await productService.getProductType(type);

    if (res.status === "OK") {
      setProducts(res.data);
    } else {
    }
  };
  useEffect(() => {
    fetchProductOfType();
  }, [type]);

  const handleNavigateProductDetail = (id) => {
    navigate(`/product-detail/${id}`);
  };

  return (
    <div
      style={{
        padding: "0 120px",
        background: "#efefef",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Row gutter={12} style={{ paddingTop: "90px" }}>
        <Col span={4}>
          <div style={{ padding: "20px 10px", borderRadius: "6px", background: "#fff" }}>
            <NavBarComponent />
          </div>
        </Col>
        <Col span={20}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {products.map((product, index) => (
              <CardComponent
                key={index}
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
            ))}
          </div>
        </Col>
      </Row>
      {/* <div>
        <Pagination
          showQuickJumper
          total={500}
          showSizeChanger={false}
          // onChange={onChange}
          style={{ textAlign: "center", marginTop: "10px", marginBottom: "10px" }}
        />
      </div> */}
    </div>
  );
};

export default TypeProductsPage;
