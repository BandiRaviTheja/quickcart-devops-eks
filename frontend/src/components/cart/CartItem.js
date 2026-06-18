import React from "react";
import styled from "styled-components";

const Container = styled.div`
  @media (max-width: 768px) {
    margin: 10px 0;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 8px;
  }
`;

const CartItem = ({ item }) => {
  return (
    <Container>
      {/* Your existing cart item implementation */}
    </Container>
  );
};

export default CartItem;