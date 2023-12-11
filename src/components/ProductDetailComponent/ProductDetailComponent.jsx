import { StarFilled, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Col, Image, Input, Row } from "antd";
import React, { useState } from "react";

import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as productService from "../../services/productService";
import { useQuery } from "@tanstack/react-query";

const ProductDetailComponent = ({ productId }) => {
  const [numProduct, setNumProduct] = useState(1);

  const onChange = (value) => {
    const number = Number(value);
    if (number && number > 0 && number < 1000) {
      setNumProduct(number);
    } else if (value === "") {
      setNumProduct("");
    }
  };

  const getDetailsProduct = async () => {
    const res = await productService.getDetailsProduct(productId);
    return res.data;
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-detail"],
    queryFn: getDetailsProduct,
  });

  const handleChangeCount = (type) => {
    if (type === "increase") {
      onChange(numProduct + 1);
    } else {
      onChange(numProduct - 1);
    }
  };

  return (
    <Row gutter={24}>
      <Col span={10} style={{ padding: "12px", background: "#fff", borderRadius: "10px" }}>
        <Image src={productDetails?.image} preview={false} />
        <Row style={{ visibility: "hidden" }}>
          <Col span={4}>
            <Image
              src="https://salt.tikicdn.com/cache/100x100/ts/product/f3/0e/72/b5aebf9321d23f9d28703ad58c631389.jpg.webp"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              src="https://salt.tikicdn.com/cache/100x100/ts/product/c2/95/b0/405e3bc7267cd545c76fd6eb93fa6045.png.webp"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              src="https://salt.tikicdn.com/cache/100x100/ts/product/f3/0e/72/b5aebf9321d23f9d28703ad58c631389.jpg.webp"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              src="https://salt.tikicdn.com/cache/100x100/ts/product/c2/95/b0/405e3bc7267cd545c76fd6eb93fa6045.png.webp"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              src="https://salt.tikicdn.com/cache/100x100/ts/product/f3/0e/72/b5aebf9321d23f9d28703ad58c631389.jpg.webp"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              src="https://salt.tikicdn.com/cache/100x100/ts/product/c2/95/b0/405e3bc7267cd545c76fd6eb93fa6045.png.webp"
              preview={false}
            />
          </Col>
        </Row>
      </Col>
      <Col span={14} style={{ paddingBottom: "48px" }}>
        <div
          style={{
            background: "#fff",
            height: "100%",
            borderRadius: "10px",
            padding: "24px",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: 300,
              lineHeight: "32px",
              wordBreak: "break-word",
            }}
          >
            {productDetails?.name}
          </span>
          <div>
            <StarFilled style={{ fontSize: "12px", color: "rgb(253, 216, 54)" }} />
            <StarFilled style={{ fontSize: "12px", color: "rgb(253, 216, 54)" }} />
            <StarFilled style={{ fontSize: "12px", color: "rgb(253, 216, 54)" }} />
            <StarFilled style={{ fontSize: "12px", color: "rgb(253, 216, 54)" }} />
            <StarFilled style={{ fontSize: "12px", color: "rgb(253, 216, 54)" }} />

            <span
              style={{
                marginLeft: "4px",
                fontSize: "15px",
                lineHeight: "24px",
                color: "rgb(120, 120, 120)",
              }}
            >
              | Đã bán {productDetails?.selled}
            </span>
          </div>
          <div
          // style={{ background: "rgb(250, 250, 250)", borderRadius: "4px" }}
          >
            <div
              style={{
                fontSize: "32px",
                lineHeight: "40px",
                marginRight: "8px",
                fontWeight: 500,
                padding: "10px 0",
              }}
            >
              {productDetails?.price?.toLocaleString()}đ
            </div>
          </div>
          <div>
            <span>Giao đến </span>
            <span
              style={{
                textDecoration: "underline",
                fontSize: "15px",
                lineHeight: "24px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Thành phố Hồ Chí Minh
            </span>
            <span
              style={{
                color: "rgb(11, 116, 229)",
                fontSize: "16px",
                lineHeight: "24px",
                fontWeight: 500,
              }}
            >
              {" "}
              Đổi địa chỉ
            </span>
          </div>
          <div style={{ margin: "16px 0" }}>
            <span>Số lượng</span>

            <div
              style={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              {/* <ButtonComponent icon={<PlusOutlined />}></ButtonComponent> */}
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  height: "30px",
                  width: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => {
                  handleChangeCount("descrease");
                }}
              >
                <MinusOutlined style={{ fontSize: "16px" }} />
              </div>
              <Input
                value={numProduct}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                onBlur={() => {
                  if (numProduct === "") {
                    setNumProduct(1);
                  }
                }}
                style={{
                  width: "50px",
                  textAlign: "center",
                }}
              />
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  height: "30px",
                  width: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => {
                  handleChangeCount("increase");
                }}
              >
                <PlusOutlined style={{ fontSize: "16px" }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <ButtonComponent
              size={40}
              style={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "220px",
                color: "#fff",
                fontWeight: 500,
                fontSize: "15px",
              }}
            >
              Chọn mua
            </ButtonComponent>
            <ButtonComponent
              size={40}
              style={{
                background: "#fff",
                height: "48px",
                width: "220px",
                color: "rgb(13,92,182)",
                fontWeight: 500,
                border: "1px solid rgb(13,92,182)",
              }}
            >
              Thêm vào Giỏ
            </ButtonComponent>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProductDetailComponent;
