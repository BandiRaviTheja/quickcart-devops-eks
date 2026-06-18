// Newsletter.js - UPDATED
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: auto;
  padding: 40px 20px;
  background-color: #fcf5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  @media (min-width: 768px) {
    height: 60vh;
    padding: 60px 20px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 4.5rem;
  }
`;

const Desc = styled.div`
  font-size: 1rem;
  font-weight: 300;
  margin-bottom: 30px;
  text-align: center;
  max-width: 90%;
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
    max-width: 70%;
  }
  
  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
  border-radius: 8px;
  overflow: hidden;
  
  @media (min-width: 768px) {
    width: 80%;
    max-width: 600px;
  }
`;

const Input = styled.input`
  border: none;
  flex: 8;
  padding: 0 20px;
  font-size: 16px;
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 480px) {
    padding: 0 15px;
    font-size: 14px;
  }
`;

const Button = styled.button`
  flex: 1;
  border: none;
  background-color: teal;
  color: white;
  cursor: pointer;
  min-width: 60px;
  font-size: 16px;
  
  &:hover {
    background-color: #008080;
  }
`;

const Newsletter = () => {
  return (
    <Container>
      <Title>Newsletter</Title>
      <Desc>Get timely updates from your favorite products.</Desc>
      <InputContainer>
        <Input placeholder="Your email" />
        <Button>
          <i className="fas fa-paper-plane"></i>
        </Button>
      </InputContainer>
    </Container>
  );
};

export default Newsletter;