import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 20px;
  justify-content: center; // Center items on mobile
  flex-wrap: wrap;
  gap: 15px;
  
  @media (min-width: 768px) {
    justify-content: space-between;
  }
`;