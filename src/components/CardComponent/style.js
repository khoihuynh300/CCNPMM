import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
  width: 200px;
  overflow: hidden;
  border: 0px;
  & img {
    height: 200px;
  }
`;

export const StyleNameProduct = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgb(56, 56, 61);
`;

export const WrapperReportText = styled.div`
  font-size: 11px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  margin-top: 6px;
`;

export const WrapperPriceText = styled.div`
  color: rgb(255, 66, 78);
  font-size: 16px;
  font-weight: 500;
`;

export const WrapperPriceOrigin = styled.span`
  color: #9e9e9e;
  font-size: 16px;
  font-weight: 500;
  text-decoration: line-through;
`;

export const WrapperDiscountText = styled.span`
  color: #212121;
  font-size: 12px;
  font-weight: 600;
  margin-left: 10px;
`;
