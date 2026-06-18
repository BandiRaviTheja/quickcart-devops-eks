import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Slider from "../components/Slider";
import Announcement from "../components/Announcement";
import Categories from "../components/Categories";
import Products from "../components/Products";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  overflow-x: hidden;
  padding: 0 !important;
  margin: 0 !important;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: red;
`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        
        let productsData = [];
        if (response.data && Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        } else if (response.data && typeof response.data === 'object') {
          productsData = Object.values(response.data);
        }
        
        setProducts(productsData);
        
      } catch (error) {
        console.error("Error fetching products:", error);
        const errorMessage = error.response 
          ? `Server error: ${error.response.status}`
          : "Network error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        <Announcement />
        <Slider />
        <Categories />
        <LoadingMessage>Loading products...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Announcement />
      <Slider />
      <Categories />
      
      {error && (
        <ErrorMessage>
          <h3>Failed to load products</h3>
          <p>{error}</p>
        </ErrorMessage>
      )}
      
      {!error && products.length > 0 && (
        <Products products={products} loading={loading} />
      )}
      
      {!error && products.length === 0 && (
        <ErrorMessage>
          <h3>No Products Found</h3>
        </ErrorMessage>
      )}
    </Container>
  );
};

export default Home;