import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column; // Stack on mobile
  
  @media (min-width: 768px) {
    flex-direction: row; // Side by side on desktop
  }
`;

export const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  text-align: center; // Center on mobile
  
  @media (min-width: 768px) {
    text-align: left;
  }
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

export const Desc = styled.p`
  margin: 20px 0px;
  font-size: 14px;
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

export const SocialContainer = styled.div`
  display: flex;
  justify-content: center; // Center on mobile
  
  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

// ... rest of your footer styles remain similar

export const ListItem = styled.li`
  width: 100%; // Full width on mobile
  margin-bottom: 10px;
  text-align: center;
  
  @media (min-width: 768px) {
    width: 50%; // Half width on desktop
    text-align: left;
  }
`;

export const Payment = styled.img`
  width: 100%; // Full width on mobile
  max-width: 300px; // Limit maximum size
  
  @media (min-width: 768px) {
    width: 50%;
  }
`;