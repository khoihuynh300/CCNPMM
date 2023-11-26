import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  padding: 10px 120px;
  background-color: rgb(26, 148, 255);
  align-items: center;
`;
export const WrapperTextHeader = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
`;

export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  cursor: pointer;
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  &:hover {
    color: rgb(26, 148, 255);
  }
`;
