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
import { searchProduct } from "../../redux/slices/productSlice";
import * as userService from "../../services/userService";

const HeaderComponent = ({ isAdmin = false }) => {
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const order = useSelector((state) => state.order)
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

  const onSearch = (e) => {
    dispatch(searchProduct(e.target.value));
  };

  const content = (
    <div>
      {!isAdmin && (
        <WrapperContentPopup onClick={handleNavigateProfile}>
          Thông tin người dùng
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  return (
    <div style={{ overflow: "hidden", position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
      <WrapperHeader gutter={16}>
        <Col span={6}>
          <WrapperTextHeader onClick={handleNavigateHome}>ECOMMERCE</WrapperTextHeader>
        </Col>
        <Col span={12} style={{ visibility: isAdmin && "hidden" }}>
          <ButtonInputSearch
            size="large"
            placeholder="Search"
            textButton="Tìm kiếm"
            bordered={false}
            onChange={onSearch}
            // backgroundColorInput="#fff"
            // backgroundColorButton="#fff"
            // colorButton="#333"
          />
        </Col>
        <Col span={6} style={{ display: "flex", gap: "30px", justifyContent: "flex-end" }}>
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
          {!isAdmin && (
            <WrapperHeaderAccount onClick={()=>{navigate("/cart")}}>
              <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined style={{ fontSize: "30px", color: "#fff" }} />
              </Badge>
              <span>Giỏ hàng</span>
            </WrapperHeaderAccount>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
