// Slider.js - UPDATED
import React, { useState } from "react";
import styled from "styled-components";
import { sliderItems } from "../data";

const Container = styled.div`
  width: 100%;
  height: 60vh;
  display: flex;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    height: 80vh;
  }
  
  @media (min-width: 1024px) {
    height: 100vh;
  }
`;

const Arrow = styled.div`
  width: 40px;
  height: 40px;
  background-color: #fff7f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.direction === "left" && "10px"};
  right: ${(props) => props.direction === "right" && "10px"};
  margin: auto;
  cursor: pointer;
  opacity: 0.7;
  z-index: 2;
  font-size: 18px;
  font-weight: bold;
  
  &:hover {
    opacity: 1;
  }
  
  @media (min-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  transition: all 1.5s ease;
  transform: translateX(${(props) => props.slideIndex * -100}vw);
`;

const Slide = styled.div`
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #${(props) => props.bg};
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ImgContainer = styled.div`
  height: 50%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    height: 100%;
  }
`;

const Image = styled.img`
  height: 80%;
  max-width: 90%;
  object-fit: contain;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 50px;
    text-align: left;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 15px;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 4rem;
  }
`;

const Desc = styled.p`
  margin: 20px 0px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  line-height: 1.5;
  
  @media (min-width: 768px) {
    font-size: 18px;
    margin: 30px 0px;
    letter-spacing: 2px;
  }
  
  @media (min-width: 1024px) {
    font-size: 20px;
    margin: 50px 0px;
    letter-spacing: 3px;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: transparent;
  cursor: pointer;
  border: 2px solid black;
  transition: all 0.3s ease;
  min-height: 44px;
  
  &:hover {
    background-color: black;
    color: white;
  }
  
  @media (min-width: 768px) {
    font-size: 18px;
    padding: 15px 30px;
  }
`;

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const handleClick = (direction) => {
    if (direction === "left") {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : 2);
    } else {
      setSlideIndex(slideIndex < 2 ? slideIndex + 1 : 0);
    }
  };

  return (
    <Container>
      <Arrow direction="left" onClick={() => handleClick("left")}>
        ←
      </Arrow>
      <Wrapper slideIndex={slideIndex}>
        {sliderItems.map((item) => (
          <Slide bg={item.bg} key={item.id}>
            <ImgContainer>
              <Image src={item.img} />
            </ImgContainer>
            <InfoContainer>
              <Title>{item.title}</Title>
              <Desc>{item.desc}</Desc>
              <Button>SHOW NOW</Button>
            </InfoContainer>
          </Slide>
        ))}
      </Wrapper>
      <Arrow direction="right" onClick={() => handleClick("right")}>
        →
      </Arrow>
    </Container>
  );
};

export default Slider;