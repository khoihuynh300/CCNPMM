import { Col, Row } from "antd";
import React from "react";
import NavBarComponent from "../../components/NavBarComponent/NavBarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";

const TypeProductsPage = () => {
  return (
    <Row
      style={{ padding: "0 120px", background: "#efefef", paddingTop: "12px" }}
      gutter={12}
    >
      <Col
        span={4}
        style={{ padding: "10px", borderRadius: "6px", background: "#fff" }}
      >
        <NavBarComponent />
      </Col>
      <Col span={20}>
        <Row gutter={[6, 6]}>
          <Col span={4}>
            <CardComponent />
          </Col>
          <Col span={4}>
            <CardComponent />
          </Col>
          <Col span={4}>
            <CardComponent />
          </Col>
          <Col span={4}>
            <CardComponent />
          </Col>
          <Col span={4}>
            <CardComponent />
          </Col>
          <Col span={4}>
            <CardComponent />
          </Col>
          <Col span={4}>
            <CardComponent />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default TypeProductsPage;
