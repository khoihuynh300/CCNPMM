import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  justify-content: flex-start;
  border-bottom: 1px solid #f5f5fa;
  height: 44px;
`;

export const WrapperButtonHover = styled(ButtonComponent)`
  color: #fff;
  &:hover {
    color: #fff;
    background: rgb(13, 92, 182);
    span {
      color: #fff;
    }
  }
`;
