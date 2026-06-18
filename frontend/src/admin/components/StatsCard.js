import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  border-left: 4px solid ${props => props.color || '#667eea'};
  
  h3 {
    color: #666;
    margin-bottom: 10px;
    font-size: 14px;
    text-transform: uppercase;
  }
  
  .number {
    font-size: 2.5em;
    font-weight: bold;
    color: ${props => props.color || '#667eea'};
  }
  
  .trend {
    margin-top: 10px;
    font-size: 14px;
    color: ${props => props.trend === 'up' ? '#28a745' : '#dc3545'};
  }
`;

const StatsCard = ({ title, value, color, trend, trendValue }) => {
  return (
    <Card color={color}>
      <h3>{title}</h3>
      <div className="number">{value}</div>
      {trend && (
        <div className="trend">
          {trend === 'up' ? '↗' : '↘'} {trendValue}
        </div>
      )}
    </Card>
  );
};

export default StatsCard;