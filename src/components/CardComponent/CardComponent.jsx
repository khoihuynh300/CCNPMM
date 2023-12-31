import React from "react";

import {
  StyleNameProduct,
  WrapperReportText,
  WrapperPriceText,
  WrapperDiscountText,
  WrapperCardStyle,
  WrapperPriceOrigin,
} from "./style";
import { StarFilled } from "@ant-design/icons";

const CardComponent = (props) => {
  const {
    countInStock,
    discount,
    image,
    name,
    price,
    rating,
    type,
    selled,
    onClick = () => {},
  } = props;
  return (
    <WrapperCardStyle
      hoverable
      bodyStyle={{ padding: "10px" }}
      cover={<img alt="img" src={image} />}
      onClick={onClick}
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      {/* <WrapperReportText>
        <span>
          <span>{rating}</span>
          <StarFilled style={{ fontSize: "12px", color: "rgb(253, 216, 54)" }} />
        </span>
        <span
          style={{
            marginLeft: "4px",
            fontSize: "15px",
            lineHeight: "24px",
            color: "rgb(120, 120, 120)",
          }}
        >
          Đã bán {selled}
        </span>
      </WrapperReportText> */}
      {discount !== 0 ? (
        <>
          <WrapperPriceOrigin>{price?.toLocaleString()} đ</WrapperPriceOrigin>
          <WrapperDiscountText>-{discount}%</WrapperDiscountText>
          <WrapperPriceText>{(price - price*discount/100).toLocaleString()} đ</WrapperPriceText>
        </>
      ) : (
        <WrapperPriceText>{price?.toLocaleString()} đ</WrapperPriceText>
      )}
      {/* <WrapperPriceText>
        {price?.toLocaleString()}đ <WrapperDiscountText>-{discount}%</WrapperDiscountText>
      </WrapperPriceText> */}
    </WrapperCardStyle>
  );
};

export default CardComponent;
