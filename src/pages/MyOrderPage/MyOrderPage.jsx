import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { useSelector } from "react-redux";
import { convertPrice, formatDateTime } from "../../utils";
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperHeaderItem,
  WrapperFooterItem,
  WrapperContainer,
  WrapperStatus,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { message } from "antd";

const MyOrderPage = () => {
  const user = useSelector((state) => state.user);
  const fetchMyOrder = async (id, access_token) => {
    const res = await OrderService.getOrderByUserId(user?.id, user?.access_token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
    enabled: !!user?.id && !!user?.access_token,
  });
  const { isLoading, data } = queryOrder;

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCancleOrder = (order) => {
    mutation.mutate(
      { id: order._id, token: user?.access_token, orderItems: order?.orderItems, userId: user.id },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancle,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success("Đã hủy");
    } else if (isSuccessCancel && dataCancel?.status === "ERR") {
      message.error(dataCancel?.message);
    } else if (isErrorCancle) {
      message.error();
    }
  }, [isErrorCancle, isSuccessCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => {
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
          <div style={{ color: "#242424", marginLeft: "auto", marginRight:"6px", fontSize: "18px", position:"relative" }}>
            <span style={{position:"absolute", left:0, transform: "translate(-100%, -1%)", fontSize:"16px"}}>x</span>{order?.amount}
          </div>
        </WrapperHeaderItem>
      );
    });
  };

  return (
    <WrapperContainer>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h4>Đơn hàng của tôi</h4>
        <WrapperListOrder>
          {data?.map((order) => {
            return (
              <WrapperItemOrder key={order?._id}>
                <WrapperStatus>
                  <div>
                    <span>Ngày đặt: </span>
                    <span>{`${formatDateTime(order.createdAt)}`}</span>
                  </div>
                  <div>
                    <span>Trạng thái: </span>
                    <span
                      style={{ color: "#1a94ff", fontWeight: "bold" }}
                    >{`${order.status}`}</span>
                  </div>
                </WrapperStatus>
                {renderProduct(order?.orderItems)}
                <WrapperFooterItem>
                  <div>
                    <span>Tổng tiền: </span>
                    <span style={{ fontSize: "18px", color: "rgb(56, 56, 61)", fontWeight: 700 }}>
                      {convertPrice(order?.totalPrice)}
                    </span>
                  </div>
                  {(order.status === "Chưa xác nhận" || order.status === "Đã xác nhận") && <div style={{ display: "flex", gap: "10px" }}>
                    <ButtonComponent
                      onClick={() => handleCancleOrder(order)}
                      size={40}
                      style={{
                        height: "36px",
                        border: "1px solid #1a94ff",
                        borderRadius: "4px",
                      }}
                    >
                      <div style={{ color: "#1a94ff", fontSize: "18px" }}>Hủy đơn hàng</div>
                    </ButtonComponent>
                  </div>}
                </WrapperFooterItem>
              </WrapperItemOrder>
            );
          })}
        </WrapperListOrder>
      </div>
    </WrapperContainer>
  );
};

export default MyOrderPage;
