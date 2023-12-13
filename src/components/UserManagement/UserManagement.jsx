import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperUploadFile } from "./style";
import { getBase64 } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as userService from "../../services/userService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const user = useSelector((state) => state?.user);

  const initial = () => ({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    address: "",
  });
  const [stateUserDetails, setStateUserDetails] = useState(initial());

  const [updateUserForm] = Form.useForm();

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = userService.updateUser(id, rests, token);
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = userService.deleteUser(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = userService.deleteManyUser(ids, token);
    return res;
  });

  const {
    data: dataUpdate,
    error: errorUpdate,
    isPending: isPendingUpdate,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isPending: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isPending: isLoadingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const getAllUsers = async () => {
    const res = await userService.getAllUser(user?.access_token);
    return res;
  };

  const getDetailsuser = async (rowSelected, access_token) => {
    const res = await userService.getDetailUser(rowSelected, access_token);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        avatar: res?.data?.avatar,
        address: res?.data?.address,
      });
    }
  };
  const queryUsers = useQuery({ queryKey: ["users"], queryFn: getAllUsers });
  const { isPending: isLoadingUsers, data: users } = queryUsers;

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      getDetailsuser(rowSelected, user?.access_token);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    updateUserForm.setFieldsValue(stateUserDetails);
  }, [updateUserForm, stateUserDetails]);

  useEffect(() => {
    if (isSuccessUpdate) {
      if (dataUpdate?.status === "OK") {
        message.success("Cập nhật tài khoản thành công");
      } else {
        message.error(dataUpdate.message);
      }
    } else if (isErrorUpdate) {
      console.log(errorUpdate);
      message.error("Lỗi");
    }
  }, [isSuccessUpdate, isErrorUpdate]);

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "OK") {
      message.success("Đã xóa tài khoản");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Lỗi");
    }
  }, [isSuccessDelected, isErrorDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      message.success("Xóa thành công")
    } else if (isErrorDeletedMany) {
      message.error("Lỗi")
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany])

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsUser}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        {
          text: "TRUE",
          value: "TRUE",
        },
        {
          text: "FALSE",
          value: "FALSE",
        },
      ],
      onFilter: (value, record) => record.isAdmin === value,
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   render: renderAction,
    // },
  ];

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };

  const dataTable = users?.data.map((item) => {
    return { ...item, key: item._id, isAdmin: item.isAdmin ? "TRUE" : "FALSE" };
  });

  const handleDetailsUser = () => {
    setIsOpenDrawer(true);
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSettled: () => {
          queryUsers.refetch();
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUsers.refetch();
        },
      }
    );
  };

  const handleDeleteManyUsers = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUsers.refetch();
        },
      }
    );
  };

  return (
    <div>
      <h2>Quản lý người dùng</h2>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          data={dataTable}
          columns={columns}
          handleDeleteMany={handleDeleteManyUsers}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>

      <Drawer
        title="Chi tiết tài khoản"
        open={isOpenDrawer}
        placement="right"
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Form
          name="updateUser"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          onFinish={onUpdateUser}
          autoComplete="on"
          form={updateUserForm}
        >
          <Form.Item label="Name" name="name">
            <InputComponent
              value={stateUserDetails.name}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <InputComponent
              value={stateUserDetails.email}
              onChange={handleOnchangeDetails}
              name="email"
            />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <InputComponent
              value={stateUserDetails.phone}
              onChange={handleOnchangeDetails}
              name="phone"
            />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <InputComponent
              value={stateUserDetails.address}
              onChange={handleOnchangeDetails}
              name="address"
            />
          </Form.Item>

          <Form.Item label="Avatar" name="avatar">
            <WrapperUploadFile
              beforeUpload={() => {
                return false;
              }}
              onChange={handleOnchangeAvatarDetails}
              maxCount={1}
            >
              <Button>Select File</Button>
              {stateUserDetails?.avatar && (
                <img
                  src={stateUserDetails?.avatar}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="avatar"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <div>Bạn có chắc xóa sản phẩm này không?</div>
      </Modal>
    </div>
  );
};

export default UserManagement;
