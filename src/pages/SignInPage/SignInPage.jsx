import React, { useEffect, useState } from "react";
import { Image, message } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import imageLogo from "../../assets/images/logo-login.png";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as userService from "../../services/userService";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slices/userSlice";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const mutation = useMutationHooks((data) => userService.loginUser(data));
  const { data, error, isPending, isSuccess, isError } = mutation;
  useEffect(() => {
    if (isSuccess) {
      if (data?.status !== "ERR") {
        message.success("Success");
        localStorage.setItem("access_token", data?.access_token);
        if (data?.access_token) {
          const decoded = jwtDecode(data?.access_token);
          if (decoded?.id) {
            handleGetDetailUser(decoded?.id, data?.access_token);
          }
        }
        navigate("/");
      }
    } else if (isError) {
      message.error("Error");
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, access_token) => {
    const res = await userService.getDetailUser(id, access_token);
    dispatch(updateUser({ ...res?.data, access_token }));
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSignIn = () => {
    mutation.mutate({ email, password });
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
          {data?.status === "ERR" && <span style={{ color: "red" }}>{data?.message}</span>}
          {/* <LoadingComponent isLoading={true}> */}
          <ButtonComponent
            disabled={!email.length || !password.length}
            size="large"
            style={{
              background: "rgb(255, 57, 69)",
              color: "#fff",
              marginTop: "24px",
            }}
            onClick={handleSignIn}
          >
            Đăng nhập
          </ButtonComponent>
          {/* </LoadingComponent> */}
          <p>
            <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
          </p>
          <p>
            Chưa có tài khoản?{" "}
            <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight>
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

export default SignInPage;
