import React, { useEffect, useState } from "react";
import { Image, message } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/images/logo-login.png";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as userService from "../../services/userService";

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowComfimPassword, setIsShowComfimPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutationHooks((data) => userService.signupUser(data));
  const { data, error, isPending, isSuccess, isError } = mutation;
  useEffect(() => {
    if (isSuccess) {
      if (data?.status !== "ERR") {
        message.success("Success");
        handleNavigateSignIn();
      }
    } else if (isError) {
      message.error("Error");
    }
  }, [isSuccess, isError]);

  const navigate = useNavigate();

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSignUp = () => {
    mutation.mutate({ email, password, confirmPassword });
  };

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
          <InputForm
            placeholder="Email"
            style={{ borderRadius: "0px" }}
            value={email}
            onChange={handleChangeEmail}
          />
          <div style={{ position: "relative" }}>
            <InputForm
              placeholder="Password"
              style={{ marginTop: "10px", borderRadius: "0px" }}
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleChangePassword}
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
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
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
          {data?.status === "ERR" && <span style={{ color: "red" }}>{data?.message}</span>}
          <ButtonComponent
            disabled={!email.length || !password.length || !confirmPassword}
            size="large"
            style={{
              background: "rgb(255, 57, 69)",
              color: "#fff",
              marginTop: "24px",
            }}
            onClick={handleSignUp}
          >
            Đăng ký
          </ButtonComponent>
          <p>
            Bạn đã có tài khoản?{" "}
            <WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="iamge-logo" height="203px" width="203px" />
          <h4>Mua sắm tại Ecommerce</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
