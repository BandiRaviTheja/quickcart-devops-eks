import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Products from "../components/Products";

const Container = styled.div`
  padding: 20px;
  min-height: 80vh;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin: 20px 0 40px 0;
  font-size: 2.5rem;
  font-weight: 300;
  color: #2d3748;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 15px auto;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin: 15px 0 30px 0;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin: 10px 0 25px 0;
    
    &::after {
      width: 60px;
      margin: 12px auto;
    }
  }
`;

const SearchInfo = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: #718096;
  font-size: 1.1rem;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 25px;
    font-size: 0.95rem;
    padding: 0 15px;
  }
`;

const SearchQuery = styled.span`
  color: #2d3748;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #718096;
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 60px 20px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 40px 15px;
    font-size: 0.95rem;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #718096;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    padding: 60px 20px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 40px 15px;
    font-size: 0.95rem;
  }
`;

const SearchSuggestions = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #a0aec0;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-top: 15px;
  }
`;

const BackButton = styled.button`
  display: block;
  margin: 30px auto;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: 480px) {
    margin: 20px auto;
    padding: 12px 24px;
    font-size: 13px;
    width: 90%;
    max-width: 250px;
  }
`;

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && query) {
      const searchTerm = query.toLowerCase();
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.categories && product.categories.some(cat => 
          cat.toLowerCase().includes(searchTerm)
        ))
      );
      setFilteredProducts(filtered);
    } else if (products.length > 0 && !query) {
      setFilteredProducts([]);
    }
  }, [products, query]);

  const handleBackToProducts = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '15px', display: 'block' }}></i>
          Searching products...
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Search Results</Title>
      
      {query ? (
        <SearchInfo>
          {filteredProducts.length > 0 ? (
            <>
              Found <strong>{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? 's' : ''} for {" "}
              <SearchQuery>"{query}"</SearchQuery>
            </>
          ) : (
            <>
              No products found for <SearchQuery>"{query}"</SearchQuery>
            </>
          )}
        </SearchInfo>
      ) : (
        <SearchInfo>
          Please enter a search term to find products
        </SearchInfo>
      )}

      {filteredProducts.length > 0 ? (
        <>
          <Products products={filteredProducts} loading={false} />
          <BackButton onClick={handleBackToProducts}>
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
            Back to Products
          </BackButton>
        </>
      ) : query ? (
        <NoResults>
          <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px', display: 'block', color: '#cbd5e0' }}></i>
          No products found for <SearchQuery>"{query}"</SearchQuery>
          
          <SearchSuggestions>
            <p style={{ marginBottom: '10px' }}>Try these suggestions:</p>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
              <li>• Check your spelling</li>
              <li>• Use more general keywords</li>
              <li>• Try different product names</li>
              <li>• Browse by category instead</li>
            </ul>
          </SearchSuggestions>
          
          <BackButton onClick={handleBackToProducts}>
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
            Back to All Products
          </BackButton>
        </NoResults>
      ) : (
        <NoResults>
          <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px', display: 'block', color: '#cbd5e0' }}></i>
          Start typing in the search bar to find products
          
          <BackButton onClick={handleBackToProducts}>
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
            Back to Shopping
          </BackButton>
        </NoResults>
      )}
    </Container>
  );
};

export default SearchResults;