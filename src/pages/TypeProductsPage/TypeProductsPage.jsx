import { Col, Pagination, Row } from "antd";
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
        </div>
        {/* <Row gutter={[6, 6]}>
          <Col span={5}>
          <CardComponent />
          </Col>
          <Col span={5}>
            <CardComponent />
          </Col>
          <Col span={5}>
            <CardComponent />
          </Col>
          <Col span={5}>
            <CardComponent />
          </Col>
          <Col span={5}>
            <CardComponent />
          </Col>
          <Col span={5}>
            <CardComponent />
          </Col>
          <Col span={5}>
            <CardComponent />
          </Col>
        </Row> */}
        <div>
          <Pagination
            showQuickJumper
            total={500}
            showSizeChanger={false}
            // onChange={onChange}
            style={{ textAlign: "center", marginTop: "10px" }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default TypeProductsPage;
