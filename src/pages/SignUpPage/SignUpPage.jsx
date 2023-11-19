import React, { useState } from "react";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/images/logo-login.png";

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowComfimPassword, setIsShowComfimPassword] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0, 0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập vào tạo tài khoản</p>
          <InputForm placeholder="Email" style={{ borderRadius: "0px" }} />
          <div style={{ position: "relative" }}>
            <InputForm
              placeholder="Password"
              style={{ marginTop: "10px", borderRadius: "0px" }}
              type={isShowPassword ? "text" : "password"}
            />
            <span
              onClick={() => {
                setIsShowPassword(!isShowPassword);
              }}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "16px",
                right: "8px",
                userSelect: "none",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <InputForm
              placeholder="Comfirm password"
              style={{ marginTop: "10px", borderRadius: "0px" }}
              type={isShowComfimPassword ? "text" : "password"}
            />
            <span
              onClick={() => {
                setIsShowComfimPassword(!isShowComfimPassword);
              }}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "16px",
                right: "8px",
                userSelect: "none",
              }}
            >
              {isShowComfimPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
          </div>
          <ButtonComponent
            size={40}
            style={{
              background: "rgb(255, 57, 69)",
              color: "#fff",
              marginTop: "24px",
            }}
          >
            Đăng ký
          </ButtonComponent>
          <p>
            Bạn đã có tài khoản?{" "}
            <WrapperTextLight onClick={() => {}}>Đăng nhập</WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="iamge-logo"
            height="203px"
            width="203px"
          />
          <h4>Mua sắm tại Ecommerce</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
