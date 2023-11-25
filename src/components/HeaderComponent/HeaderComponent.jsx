import React from "react";
import { Badge, Col, Popover } from "antd";
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
  WrapperContentPopup,
} from "./style";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { resetUser } from "../../redux/slices/userSlice";
import * as userService from "../../services/userService";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await userService.logoutUser();
    localStorage.removeItem("access_token");
    dispatch(resetUser());
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };
  const content = (
    <div>
      <WrapperContentPopup>Thông tin người dùng</WrapperContentPopup>
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  return (
    <div>
      <WrapperHeader gutter={16}>
        <Col span={6}>
          <WrapperTextHeader>ECOMMERCE</WrapperTextHeader>
        </Col>
        <Col span={12}>
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
            {user?.name ? (
              <Popover content={content} trigger="click">
                <div>{user.name}</div>
              </Popover>
            ) : (
              <div onClick={handleNavigateSignIn}>
                <span>Đăng nhập</span>
                <div>
                  <span>Tài khoản</span>
                  <CaretDownOutlined />
                </div>
              </div>
            )}
          </WrapperHeaderAccount>
          <WrapperHeaderAccount>
            <Badge count={4} size="small">
              <ShoppingCartOutlined style={{ fontSize: "30px", color: "#fff" }} />
            </Badge>
            <span>Giỏ hàng</span>
          </WrapperHeaderAccount>
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
