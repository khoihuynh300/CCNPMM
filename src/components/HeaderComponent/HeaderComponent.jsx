import React from "react";
import { Col, Input } from "antd";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
} from "./style";

import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";

const { Search } = Input;

const HeaderComponent = () => {
  return (
    <div>
      <WrapperHeader gutter={16}>
        <Col span={6}>
          <WrapperTextHeader>ECOMMERCE</WrapperTextHeader>
        </Col>
        <Col span={12}>
          {/* <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            // onSearch={onSearch}
          /> */}
          <ButtonInputSearch
            size="large"
            placeholder="Search"
            textButton="Tìm kiếm"
            bordered={false}
            // backgroundColorInput="#fff"
            // backgroundColorButton="#fff"
            // colorButton="#333"
          />
        </Col>
        <Col span={6} style={{ display: "flex", gap: "30px" }}>
          <WrapperHeaderAccount>
            <UserOutlined style={{ fontSize: "30px" }} />
            <div>
              <span>Đăng nhập</span>
              <div>
                <span>Tài khoản</span>
                <CaretDownOutlined />
              </div>
            </div>
          </WrapperHeaderAccount>
          <WrapperHeaderAccount>
            <ShoppingCartOutlined style={{ fontSize: "30px" }} />
            <span>Giỏ hàng</span>
          </WrapperHeaderAccount>
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
