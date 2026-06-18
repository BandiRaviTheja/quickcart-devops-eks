import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  margin: 3px;
  height: 50vh; // Reduced height for mobile
  position: relative;
  
  @media (min-width: 768px) {
    height: 70vh; // Original height for desktop
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Info = styled.div`
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

export const Title = styled.h1`
  color: white;
  margin-bottom: 20px;
  font-size: 1.5rem; // Smaller on mobile
  
  @media (min-width: 768px) {
    font-size: 2rem; // Larger on desktop
  }
`;

export const Button = styled.button`
  border: none;
  padding: 10px 15px;
  background-color: white;
  color: gray;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  min-height: 44px; // Better touch target
  
  @media (min-width: 768px) {
    padding: 15px 20px;
    font-size: 16px;
  }
`;