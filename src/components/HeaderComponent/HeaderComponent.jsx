import React, { useEffect, useState } from "react";
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
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setUsername(user?.name);
    setUserAvatar(user?.avatar);
  }, [user.name, user.avatar]);

  const handleLogout = async () => {
    await userService.logoutUser();
    localStorage.removeItem("access_token");
    dispatch(resetUser());
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const content = (
    <div>
      <WrapperContentPopup onClick={handleNavigateProfile}>
        Thông tin người dùng
      </WrapperContentPopup>
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  return (
    <div>
      <WrapperHeader gutter={16}>
        <Col span={6}>
          <WrapperTextHeader onClick={handleNavigateHome}>ECOMMERCE</WrapperTextHeader>
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
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="avatar"
                style={{
                  height: "30px",
                  width: "30px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  background: "white",
                }}
              />
            ) : (
              <UserOutlined style={{ fontSize: "30px" }} />
            )}
            {user?.access_token ? (
              <Popover content={content} trigger="click">
                <div>{username || user.email}</div>
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
