import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 150px; // Smaller min-width for mobile
  height: 250px; // Smaller height for mobile
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;
  
  @media (min-width: 768px) {
    min-width: 280px;
    height: 350px;
  }
  
  &:hover ${Info} {
    opacity: 1;
  }
`;

export const Circle = styled.div`
  width: 120px; // Smaller on mobile
  height: 120px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  
  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

export const Image = styled.img`
  height: 60%; // Smaller on mobile
  z-index: 2;
  
  @media (min-width: 768px) {
    height: 75%;
  }
`;