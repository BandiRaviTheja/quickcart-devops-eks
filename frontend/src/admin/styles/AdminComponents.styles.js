import styled from 'styled-components';

// Common button styles
export const Button = styled.button`
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: #764ba2;
  }
  
  &.secondary {
    background: #6c757d;
    
    &:hover {
      background: #5a6268;
    }
  }
  
  &.danger {
    background: #e74c3c;
    
    &:hover {
      background: #c0392b;
    }
  }
  
  &.success {
    background: #28a745;
    
    &:hover {
      background: #218838;
    }
  }
`;

// Table styles
export const Table = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr 1fr'};
  padding: 15px 20px;
  background: #f8f9fa;
  font-weight: 600;
  border-bottom: 1px solid #e9ecef;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr 1fr'};
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

// Badge styles
export const Badge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  &.primary { background: #007bff; color: white; }
  &.success { background: #28a745; color: white; }
  &.warning { background: #ffc107; color: black; }
  &.danger { background: #dc3545; color: white; }
  &.info { background: #17a2b8; color: white; }
`;

// Loading and empty states
export const Loading = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  
  h3 {
    margin-bottom: 10px;
  }
`;