import React from "react";

import {
  StyleNameProduct,
  WrapperReportText,
  WrapperPriceText,
  WrapperDiscountText,
  WrapperCardStyle,
} from "./style";
import { StarFilled } from "@ant-design/icons";

const CardComponent = () => {
  return (
    <WrapperCardStyle
      hoverable
      bodyStyle={{ padding: "10px" }}
      cover={
        <img
          alt="example"
          src="https://salt.tikicdn.com/cache/750x750/ts/product/c2/95/b0/405e3bc7267cd545c76fd6eb93fa6045.png.webp"
        />
      }
    >
      <StyleNameProduct>Iphone</StyleNameProduct>
      <WrapperReportText>
        <span>
          <span>4.69</span>
          <StarFilled
            style={{ fontSize: "12px", color: "rgb(253, 216, 54)" }}
          />
        </span>
        <span
          style={{
            marginLeft: "4px",
            fontSize: "15px",
            lineHeight: "24px",
            color: "rgb(120, 120, 120)",
          }}
        >
          | Đã bán 1000+
        </span>
      </WrapperReportText>
      <WrapperPriceText>
        1.000.000đ <WrapperDiscountText>-5%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
