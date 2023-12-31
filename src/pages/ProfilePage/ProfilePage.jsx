import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import { updateUser } from "../../redux/slices/userSlice";
import * as userService from "../../services/userService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { getBase64 } from "../../utils";
import {checkVietNamPhoneNumber} from '../../utils'

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const mutation = useMutationHooks(async (data) => {
    const { id, access_token, ...rests } = data;
    return await userService.updateUser(id, rests, access_token);
  });

  const dispatch = useDispatch();
  const { data, error, isPending, isSuccess, isError } = mutation;
  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      if (data?.status === "OK") {
        message.success("success");
        handleGetDetailUser(user?.id, user?.access_token);
      }
    } else if (isError) {
      message.error("error");
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, access_token) => {
    const res = await userService.getDetailUser(id, access_token);
    dispatch(updateUser({ ...res?.data }));
  };

  const handleOnchangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleOnchangeName = (event) => {
    setName(event.target.value);
  };
  const handleOnchangePhone = (event) => {
    setPhone(event.target.value);
  };
  const handleOnchangeAddress = (event) => {
    setAddress(event.target.value);
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleUpdate = () => {
    if(!checkVietNamPhoneNumber(phone)){
      message.error("Số điện thoại không hợp lệ!")
      return
    }
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };
  return (
    <div style={{ width: "1270px", margin: "80px auto 0", height: "500px" }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <WrapperContentProfile>
        <WrapperInput>
          <WrapperLabel htmlFor="name">Tên</WrapperLabel>
          <InputForm
            style={{ width: "100%" }}
            id="name"
            value={name}
            onChange={handleOnchangeName}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="email">Email</WrapperLabel>
          <InputForm
            style={{ width: "100%", background:"#fff", color:"#333" }}
            id="email"
            value={email}
            onChange={handleOnchangeEmail}
            disabled
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="phone">Số điện thoại</WrapperLabel>
          <InputForm
            style={{ width: "100%" }}
            id="phone"
            value={phone}
            onChange={handleOnchangePhone}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="avatar">Ảnh đại diện</WrapperLabel>
          <WrapperUploadFile
            beforeUpload={() => {
              return false;
            }}
            onChange={handleOnchangeAvatar}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </WrapperUploadFile>
          {avatar && (
            <img
              src={avatar}
              style={{
                height: "60px",
                width: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt="avatar"
            />
          )}
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
          <InputForm
            style={{ width: "100%" }}
            id="address"
            value={address}
            onChange={handleOnchangeAddress}
          />
        </WrapperInput>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <ButtonComponent
            onClick={handleUpdate}
            size={40}
            style={{
              height: "30px",
              width: "fit-content",
              borderRadius: "4px",
              padding: "2px 6px 6px",
              color: "rgb(26, 148, 255)",
              fontSize: "15px",
              fontWeight: "700",
              border: "2px solid rgb(26, 148, 255)",
              
            }}
          >
            Cập nhật
          </ButtonComponent>
        </div>
      </WrapperContentProfile>
    </div>
  );
};

export default ProfilePage;
