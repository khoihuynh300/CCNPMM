import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { EditOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Select, message } from "antd";

import TableComponent from "../TableComponent/TableComponent";
import { convertPrice, formatDateTime, renderOptions } from "../../utils";
import * as OrderService from "../../services/OrderService";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { WrapperHeaderItem } from "../../pages/MyOrderPage/style";

const OrderManagement = () => {
  const initial = () => ({
    username: "",
    phone: "",
    address: "",
    status: "",
    totalPrice: "",
    createdAt: "",
    orderItems: [],
  });
  const [stateOrder, setStateOrder] = useState(initial());
  const [rowSelected, setRowSelected] = useState("");

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const user = useSelector((state) => state?.user);

  const [updateOrderForm] = Form.useForm();

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrder });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const handleDetailsOrder = () => {
    setIsOpenDrawer(true);
  };

  const handleOnchangeOrder = (e) => {
    setStateOrder({
      ...stateOrder,
      [e.target.name]: e.target.value,
    });
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, status, access_token } = data;
    const res = OrderService.updateOrder(id, status, access_token);
    return res;
  });

  const {
    data: dataUpdate,
    error: errorUpdate,
    isPending: isPendingUpdate,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
  } = mutationUpdate;

  const renderAction = () => {
    return (
      <div>
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsOrder}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
    },
    {
      title: "Created  At",
      dataIndex: "createdAt",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        isDelivered: order?.isDelivered ? "TRUE" : "FALSE",
        totalPrice: convertPrice(order?.totalPrice),
        createdAt: formatDateTime(order.createdAt),
      };
    });

  const getDetailsOrder = async (id) => {
    const res = await OrderService.getDetailsOrder(id, user?.access_token);
    if (res?.data) {
      console.log("check", res?.data?.orderItems);

      setStateOrder({
        username: res?.data?.shippingAddress?.fullName,
        phone: res?.data?.shippingAddress?.phone,
        address: res?.data?.shippingAddress?.address,
        status: res?.data?.status,
        totalPrice: res?.data?.totalPrice,
        createdAt: formatDateTime(res?.data?.createdAt),
        orderItems: res?.data?.orderItems,
      });
    }
  };

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      getDetailsOrder(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    updateOrderForm.setFieldsValue(stateOrder);
  }, [updateOrderForm, stateOrder]);

  useEffect(() => {
    if (isSuccessUpdate) {
      if (dataUpdate?.status === "OK") {
        message.success("Cập nhật trạng thái thành công");
      } else {
        message.error(dataUpdate.message);
      }
    } else if (isErrorUpdate) {
      message.error("Lỗi");
    }
  }, [isSuccessUpdate, isErrorUpdate]);

  const handleChangeSelectStatus = (value) => {
    setStateOrder({
      ...stateOrder,
      status: value,
    });
  };

  const onUpdateOrder = () => {
    mutationUpdate.mutate(
      { id: rowSelected, status: stateOrder.status, access_token: user?.access_token },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const renderProduct = (order) => {
    return (
      <WrapperHeaderItem key={order?._id}>
        <img
          src={order?.image}
          style={{
            width: "70px",
            height: "70px",
            objectFit: "cover",
            border: "1px solid rgb(238, 238, 238)",
            padding: "2px",
          }}
        />
        <div
          style={{
            width: 260,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginLeft: "10px",
          }}
        >
          {order?.name}
        </div>

        <div style={{ marginLeft: "50px" }}>
          {order?.discount ? (
            <>
              <div style={{ textDecoration: "line-through" }}>{convertPrice(order?.price)}</div>
              <div>{convertPrice(order?.price - (order?.price * order?.discount) / 100)}</div>
            </>
          ) : (
            <div>{convertPrice(order?.price)}</div>
          )}
        </div>
        <div
          style={{
            color: "#242424",
            marginLeft: "auto",
            marginRight: "6px",
            fontSize: "18px",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              transform: "translate(-100%, -1%)",
              fontSize: "16px",
            }}
          >
            x
          </span>
          {order?.amount}
        </div>
      </WrapperHeaderItem>
    );
  };

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          data={dataTable}
          enableCheckbox={false}
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
        title="Chi tiết đơn hàng"
        open={isOpenDrawer}
        placemen="right"
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Form
          name="updateOrder"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          onFinish={onUpdateOrder}
          autoComplete="on"
          form={updateOrderForm}
        >
          <Form.Item label="Username" name="username">
            <InputComponent
              style={{ background: "white", color: "#333", border: "0px" }}
              value={stateOrder.username}
              name="username"
              disabled
            />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <InputComponent
              style={{ background: "white", color: "#333", border: "0px" }}
              value={stateOrder.phone}
              name="phone"
              disabled
            />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <InputComponent
              style={{ background: "white", color: "#333", border: "0px" }}
              value={stateOrder.address}
              name="address"
              disabled
            />
          </Form.Item>
          
          <Form.Item label="Create at" name="createdAt">
            <InputComponent
              style={{ background: "white", color: "#333", border: "0px" }}
              value={formatDateTime(stateOrder.createdAt)}
              name="createdAt"
              disabled
            />
          </Form.Item>
          
          <div style={{ marginLeft: "20px" }}>
            {stateOrder?.orderItems?.map((order) => {
              return renderProduct(order);
            })}
          </div>
          
          <Form.Item label="TotalPrice" name="totalPrice">
            <InputComponent
              style={{ background: "white", color: "#333", border: "0px" }}
              value={stateOrder.totalPrice}
              name="totalPrice"
              disabled
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              name="status"
              value={stateOrder.status}
              onChange={handleChangeSelectStatus}
              options={["Chưa xác nhận", "Đã xác nhận", "Đang giao", "Đã giao", "Hủy"].map(
                (opt) => ({ value: opt, label: opt })
              )}
            />
          </Form.Item>
          

          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default OrderManagement;
