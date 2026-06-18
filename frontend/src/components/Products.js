import React from "react";
import styled from "styled-components";
import Product from "./Product";

const Container = styled.div`
  padding: 0 !important; /* REMOVED padding */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 0 !important;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 0 !important;
    gap: 8px;
  }
`;

const ProductsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  width: 100%;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const Products = ({ products, loading }) => {
  if (loading) {
    return (
      <Container>
        <div style={{ 
          textAlign: 'center', 
          width: '100%', 
          padding: '20px', 
          color: '#718096' 
        }}>
          <i className="fas fa-spinner fa-spin"></i>
          Loading...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <ProductsGrid>
        {products.map((item) => (
          <Product item={item} key={item.id} />
        ))}
      </ProductsGrid>
    </Container>
  );
};

export default Products;