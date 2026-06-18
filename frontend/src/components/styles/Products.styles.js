import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center; // Center on mobile
  
  @media (min-width: 768px) {
    justify-content: space-between; // Space between on desktop
  }
`;