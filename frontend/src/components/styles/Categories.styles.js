import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  flex-direction: column; // Stack on mobile first
  
  @media (min-width: 768px) {
    flex-direction: row; // Side by side on tablet/desktop
  }
`;