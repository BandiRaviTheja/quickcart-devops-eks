import styled from "styled-components";

export const Container = styled.div`
  height: auto; // Auto height on mobile
  padding: 40px 20px;
  background-color: #fcf5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  @media (min-width: 768px) {
    height: 60vh;
  }
`;

export const Title = styled.h1`
  font-size: 2rem; // Much smaller on mobile
  margin-bottom: 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 70px;
  }
`;

export const Desc = styled.div`
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

export const InputContainer = styled.div`
  width: 100%; // Full width on mobile
  max-width: 500px; // Limit maximum width
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
  
  @media (min-width: 768px) {
    width: 50%;
  }
`;

export const Input = styled.input`
  border: none;
  flex: 8;
  padding-left: 20px;
  font-size: 14px;
`;

export const Button = styled.button`
  flex: 1;
  border: none;
  background-color: teal;
  color: white;
  min-width: 60px; // Ensure button is tap-friendly
`;