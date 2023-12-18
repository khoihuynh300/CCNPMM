import { Form, Input, Modal, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  CustomCheckbox,
  WrapperCountOrder,
  WrapperInfo,
  WrapperInputNumber,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperProductName,
  WrapperRight,
  WrapperStyleHeader,
  WrapperTotal,
} from "./style";
import {
  changeAmount,
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slices/orderSlice";
import { updateUser } from "../../redux/slices/userSlice";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as userService from "../../services/userService";
import * as orderService from "../../services/OrderService";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { convertPrice } from "../../utils";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value);
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + (cur.discount * cur.amount * cur.price) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo);
  }, [priceMemo, priceDiscountMemo]);

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 0) {
      dispatch(removeAllOrderProduct({ listChecked }));
      setListChecked([]);
    }
  };

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = orderService.createOrder({ ...rests }, token);
    return res;
  });

  const handleOrderProduct = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user.address || !user.name) {
      setIsOpenModalUpdateInfo(true);
    } else {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        itemsPrice: priceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
      });
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = userService.updateUser(id, { ...rests }, token);
    return res;
  });

  const { isLoading, data } = mutationUpdate;
  const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      handleRemoveAllOrder();
      message.success("Đặt hàng thành công");
      navigate("/my-order");
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };
  const handleUpdateInforUser = () => {
    const { name, address, phone } = stateUserDetails;
    if (name && address && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleNavigateProductDetailPage = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  const handleClickCardItem = (productId) => {
    if (listChecked.includes(productId)) {
      const newListChecked = listChecked.filter((item) => item !== productId);
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, productId]);
    }
  };

  return (
    <div
      style={{
        background: "#f5f5fa",
        with: "100%",
        minHeight: "100vh",
        paddingTop: "60px",
        fontSize: "18px",
      }}
    >
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3 style={{ fontWeight: "bold" }}>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <CustomCheckbox
                  onChange={handleOnchangeCheckAll}
                  checked={
                    listChecked?.length !== 0 && listChecked?.length === order?.orderItems?.length
                  }
                ></CustomCheckbox>
                <span style={{ fontSize: "18px" }}>
                  {" "}
                  Tất cả ({order?.orderItems?.length} sản phẩm)
                </span>
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "18px" }}>Đơn giá</span>
                <span style={{ fontSize: "18px" }}>Số lượng</span>
                <span style={{ fontSize: "18px" }}>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer", fontSize: "20px", color: "red" }}
                  onClick={handleRemoveAllOrder}
                />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder
                    key={order?.product}
                    onClick={() => {
                      handleClickCardItem(order?.product);
                    }}
                  >
                    <div style={{ width: "390px", display: "flex", alignItems: "center", gap: 4 }}>
                      <CustomCheckbox
                        onChange={onChange}
                        value={order?.product}
                        checked={listChecked.includes(order?.product)}
                      ></CustomCheckbox>
                      <img
                        onClick={() => {
                          handleNavigateProductDetailPage(order.product);
                        }}
                        src={order?.image}
                        style={{ width: "77px", height: "79px", objectFit: "cover" }}
                      />
                      <WrapperProductName
                        onClick={() => {
                          handleNavigateProductDetailPage(order.product);
                        }}
                      >
                        {order?.name}
                      </WrapperProductName>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        {order?.discount ? (
                          <>
                            <div
                              style={{
                                color: "#242424",
                                textDecoration: "line-through",
                              }}
                            >
                              {convertPrice(order?.price)}{" "}
                            </div>
                            <div style={{ color: "#242424" }}>
                              {convertPrice(order?.price - (order?.price * order?.discount) / 100)}
                            </div>
                          </>
                        ) : (
                          <div style={{ color: "#242424" }}>{convertPrice(order?.price)}</div>
                        )}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div
                          style={{
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                            height: "30px",
                            width: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                          onClick={() => {
                            handleChangeCount("decrease", order?.product, order?.amount === 1);
                          }}
                        >
                          <MinusOutlined style={{ fontSize: "16px" }} />
                        </div>
                        <Input
                          value={order?.amount}
                          onChange={(e) => {
                            const num = Number(e.target.value);
                            if (e.target.value === "") {
                              dispatch(changeAmount({ idProduct: order?.product, amount: 1 }));
                            } else if (!isNaN(num) && num > 0 && num < 1000) {
                              dispatch(changeAmount({ idProduct: order?.product, amount: num }));
                            }
                          }}
                          style={{
                            width: "50px",
                            textAlign: "center",
                          }}
                        />
                        <div
                          style={{
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                            height: "30px",
                            width: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                          onClick={() => {
                            handleChangeCount(
                              "increase",
                              order?.product,
                              order?.amount === order.countInstock,
                              order?.amount === 1
                            );
                          }}
                        >
                          <PlusOutlined style={{ fontSize: "16px" }} />
                        </div>
                      </div>

                      {/* <WrapperCountOrder
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <button
                          style={{ border: "none", background: "transparent", cursor: "pointer" }}
                          onClick={() =>
                            handleChangeCount("decrease", order?.product, order?.amount === 1)
                          }
                        >
                          <MinusOutlined style={{ color: "#000", fontSize: "10px" }} />
                        </button>
                        <WrapperInputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                          min={1}
                          max={order?.countInstock}
                        />
                        <button
                          style={{ border: "none", background: "transparent", cursor: "pointer" }}
                          onClick={() =>
                            handleChangeCount(
                              "increase",
                              order?.product,
                              order?.amount === order.countInstock,
                              order?.amount === 1
                            )
                          }
                        >
                          <PlusOutlined style={{ color: "#000", fontSize: "10px" }} />
                        </button>
                      </WrapperCountOrder> */}
                      <span style={{ fontWeight: 500 }}>
                        {convertPrice(order?.price * order?.amount)}
                      </span>
                      <DeleteOutlined
                        style={{ cursor: "pointer", fontSize: "20px", color: "red" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order?.product);
                        }}
                      />
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>{`${user?.address}`} </span>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "#1a94ff", cursor: "pointer" }}
                  >
                    Thay đổi
                  </span>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span>Tạm tính</span>
                  <span style={{ color: "#000", fontSize: "16px", fontWeight: "bold" }}>
                    {convertPrice(priceMemo)}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span>Giảm giá</span>
                  <span style={{ color: "#000", fontSize: "16px", fontWeight: "bold" }}>
                    {convertPrice(priceDiscountMemo)}
                  </span>
                </div>
                {/* <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span>Phí giao hàng</span>
                  <span style={{ color: "#000", fontSize: "14px", fontWeight: "bold" }}>
                    ???
                  </span>
                </div> */}
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "rgb(254, 56, 52)", fontSize: "24px", fontWeight: "bold" }}>
                    {convertPrice(totalPriceMemo)}
                  </span>
                  <span style={{ color: "#000", fontSize: "11px", textAlign: "center" }}>
                    (Chưa bao gồm phí vận chuyển)
                  </span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleOrderProduct()}
              size={40}
              style={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "320px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              <div style={{ color: "#fff", fontSize: "15px", fontWeight: "700" }}>Mua hàng</div>
            </ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <Modal
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancleUpdate}
        onOk={handleUpdateInforUser}
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <InputComponent
              value={stateUserDetails["name"]}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input your  phone!" }]}
          >
            <InputComponent
              value={stateUserDetails.phone}
              onChange={handleOnchangeDetails}
              name="phone"
            />
          </Form.Item>

          <Form.Item
            label="Adress"
            name="address"
            rules={[{ required: true, message: "Please input your  address!" }]}
          >
            <InputComponent
              value={stateUserDetails.address}
              onChange={handleOnchangeDetails}
              name="address"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderPage;
