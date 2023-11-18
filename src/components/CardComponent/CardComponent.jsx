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
      {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
      <StyleNameProduct>Iphone</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: "4px" }}>
          <span>4.69</span>
          <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
        </span>
        <span>| Đã bán 1000+</span>
      </WrapperReportText>
      <WrapperPriceText>
        1.000.000đ <WrapperDiscountText>-5%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
