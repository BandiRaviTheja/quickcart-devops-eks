// Footer.js - UPDATED
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
    padding: 40px 20px;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 15px;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Desc = styled.p`
  margin: 20px 0px;
  line-height: 1.6;
  font-size: 14px;
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  
  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  background-color: #${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const Center = styled.div`
  flex: 1;
  padding: 30px 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
    padding: 40px 20px;
  }
`;

const Title = styled.h3`
  margin-bottom: 30px;
  font-size: 1.25rem;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: teal;
  }
`;

const Right = styled.div`
  flex: 1;
  padding: 30px 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
    padding: 40px 20px;
  }
`;

const ContactItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const Payment = styled.img`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
  
  @media (min-width: 768px) {
    width: 80%;
    margin: 0;
  }
`;

const Footer = () => {
  return (
    <Container>
      <Left>
        <Logo>QUICKCART.</Logo>
        <Desc>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words which don't look even slightly believable.
        </Desc>
        <SocialContainer>
          <SocialIcon color="3B5999">
            <i className="fab fa-facebook-f"></i>
          </SocialIcon>
          <SocialIcon color="E4405F">
            <i className="fab fa-instagram"></i>
          </SocialIcon>
          <SocialIcon color="55ACEE">
            <i className="fab fa-twitter"></i>
          </SocialIcon>
          <SocialIcon color="E60023">
            <i className="fab fa-pinterest-p"></i>
          </SocialIcon>
        </SocialContainer>
      </Left>
      <Center>
        <Title>Useful Links</Title>
        <List>
          <ListItem>Home</ListItem>
          <ListItem>Cart</ListItem>
          <ListItem>Man Fashion</ListItem>
          <ListItem>Woman Fashion</ListItem>
          <ListItem>Accessories</ListItem>
          <ListItem>My Account</ListItem>
          <ListItem>Order Tracking</ListItem>
          <ListItem>Wishlist</ListItem>
          <ListItem>Wishlist</ListItem>
          <ListItem>Terms</ListItem>
        </List>
      </Center>
      <Right>
        <Title>Contact</Title>
        <ContactItem>
          622 Dixie Path , South Tobinchester 98336
        </ContactItem>
        <ContactItem>+1 234 56 78</ContactItem>
        <ContactItem>contact@quickcart.dev</ContactItem>
        <Payment src="https://i.ibb.co/Qfvn4z6/payment.png" />
      </Right>
    </Container>
  );
};

export default Footer;