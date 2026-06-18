// CategoryItem.js - UPDATED
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  flex: 1;
  margin: 3px;
  height: 50vh;
  position: relative;
  min-width: 300px;
  max-width: 400px;
  
  @media (max-width: 768px) {
    height: 40vh;
    min-width: 100%;
    max-width: 100%;
    margin: 5px 0;
  }
  
  @media (max-width: 480px) {
    height: 35vh;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 15px;
  }
`;

const Button = styled.button`
  border: none;
  padding: 12px 24px;
  background-color: white;
  color: gray;
  cursor: pointer;
  font-weight: 600;
  border-radius: 25px;
  font-size: 14px;
  min-height: 44px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8f8f8;
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 12px;
  }
`;

const CategoryItem = ({ item }) => {
  return (
    <Container>
      <Image src={item.img} />
      <Info>
        <Title>{item.title}</Title>
        <Link to={`/products/${item.cat}`}>
          <Button>SHOP NOW</Button>
        </Link>
      </Info>
    </Container>
  );
};

export default CategoryItem;