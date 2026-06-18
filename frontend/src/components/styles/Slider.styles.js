import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 50vh; // Shorter on mobile
  display: flex;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    height: 100vh;
  }
`;

export const Slide = styled.div`
  width: 100vw;
  height: 50vh; // Match container height
  display: flex;
  align-items: center;
  background-color: #${(props) => props.bg};
  flex-direction: column; // Stack on mobile
  
  @media (min-width: 768px) {
    height: 100vh;
    flex-direction: row; // Side by side on desktop
  }
`;

export const ImgContainer = styled.div`
  height: 50%; // Half height on mobile
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    height: 100%;
  }
`;

export const Image = styled.img`
  height: 80%;
  max-width: 90%; // Don't overflow on mobile
`;

export const InfoContainer = styled.div`
  flex: 1;
  padding: 20px; // Less padding on mobile
  text-align: center; // Center text on mobile
  
  @media (min-width: 768px) {
    padding: 50px;
    text-align: left;
  }
`;

export const Title = styled.h1`
  font-size: 2rem; // Much smaller on mobile
  
  @media (min-width: 768px) {
    font-size: 70px;
  }
`;

export const Desc = styled.p`
  margin: 20px 0px; // Less margin on mobile
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  
  @media (min-width: 768px) {
    margin: 50px 0px;
    font-size: 20px;
    letter-spacing: 3px;
  }
`;