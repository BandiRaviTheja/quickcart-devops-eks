import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Products from "../components/Products";

const Container = styled.div`
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
  }

  @media (max-width: 480px) {
    padding: 10px 5px;
  }
`;

const Title = styled.h1`
  margin: 20px;
  text-align: center;
  text-transform: capitalize;
  font-size: 1.75rem;
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
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    margin: 15px 10px;
    font-size: 1.5rem;
    
    &::after {
      width: 60px;
      margin: 12px auto;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  flex-wrap: wrap;
  gap: 15px;
  
  @media (max-width: 768px) {
    margin: 15px 10px;
    justify-content: center;
  }

  @media (max-width: 480px) {
    margin: 10px 5px;
    gap: 10px;
  }
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    gap: 10px;
    width: 100%;
  }
`;

const FilterText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  
  @media (max-width: 480px) {
    font-size: 14px;
    width: 100%;
    text-align: center;
  }
`;

const Select = styled.select`
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 140px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
  
  &:hover {
    border-color: #cbd5e0;
  }
  
  @media (max-width: 480px) {
    min-width: 120px;
    padding: 8px 12px;
    font-size: 14px;
    flex: 1;
  }
`;

const Option = styled.option`
  padding: 10px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #718096;
  font-size: 1.1rem;
  
  i {
    font-size: 2rem;
    margin-bottom: 15px;
    display: block;
  }
  
  @media (max-width: 480px) {
    padding: 50px 20px;
    font-size: 1rem;
    
    i {
      font-size: 1.5rem;
    }
  }
`;

const ProductList = () => {
  const location = useLocation();
  const category = location.pathname.split("/")[2];
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    size: "",
    color: ""
  });

  // Fetch all products from your backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching products from API...');
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        console.log('📦 Products from API:', response.data);
        
        // If API returns products, use them
        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        } else {
          // Fallback to sample data
          console.log('⚠️ No products from API, using sample data');
          const sampleProducts = createSampleProducts();
          setProducts(sampleProducts);
        }
      } catch (error) {
        console.error("❌ Error fetching products, using sample data:", error);
        // Fallback to sample data on error
        const sampleProducts = createSampleProducts();
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    const createSampleProducts = () => {
      return [
        {
          id: 1,
          title: "Premium Wireless Headphones",
          price: 129.99,
          img: "https://via.placeholder.com/300x300/667eea/FFFFFF?text=Headphones",
          categories: ["electronics", "audio"],
          description: "High-quality wireless headphones with noise cancellation",
          color: ["black", "white", "blue"],
          size: ["One Size"],
          inventory: {
            "black": { "One Size": { quantity: 15, price: 129.99 } },
            "white": { "One Size": { quantity: 8, price: 129.99 } },
            "blue": { "One Size": { quantity: 0, price: 129.99 } }
          }
        },
        {
          id: 2,
          title: "Classic Cotton T-Shirt",
          price: 24.99,
          img: "https://via.placeholder.com/300x300/764ba2/FFFFFF?text=T-Shirt",
          categories: ["men's clothing"],
          description: "Comfortable cotton t-shirt for everyday wear",
          color: ["white", "black", "navy"],
          size: ["S", "M", "L", "XL"],
          inventory: {
            "white": { 
              "S": { quantity: 10, price: 24.99 },
              "M": { quantity: 15, price: 24.99 },
              "L": { quantity: 12, price: 24.99 }
            },
            "black": { 
              "S": { quantity: 8, price: 24.99 },
              "M": { quantity: 20, price: 24.99 }
            }
          }
        },
        {
          id: 3,
          title: "Elegant Silver Necklace",
          price: 89.99,
          img: "https://via.placeholder.com/300x300/48bb78/FFFFFF?text=Necklace",
          categories: ["jewelery", "women's"],
          description: "Beautiful silver necklace with pendant",
          color: ["silver", "rose gold"],
          size: ["One Size"],
          inventory: {
            "silver": { "One Size": { quantity: 5, price: 89.99 } },
            "rose gold": { "One Size": { quantity: 3, price: 99.99 } }
          }
        },
        {
          id: 4,
          title: "Running Shoes",
          price: 79.99,
          img: "https://via.placeholder.com/300x300/ed8936/FFFFFF?text=Shoes",
          categories: ["shoes", "sports"],
          description: "Lightweight running shoes for maximum comfort",
          color: ["black", "blue", "red"],
          size: ["8", "9", "10", "11"],
          inventory: {
            "black": { 
              "8": { quantity: 7, price: 79.99 },
              "9": { quantity: 4, price: 79.99 }
            },
            "blue": { 
              "9": { quantity: 6, price: 79.99 },
              "10": { quantity: 8, price: 79.99 }
            }
          }
        },
        {
          id: 5,
          title: "Smart Watch",
          price: 199.99,
          img: "https://via.placeholder.com/300x300/4299e1/FFFFFF?text=Watch",
          categories: ["electronics", "wearables"],
          description: "Feature-rich smartwatch with health monitoring",
          color: ["black", "silver"],
          size: ["One Size"],
          inventory: {
            "black": { "One Size": { quantity: 12, price: 199.99 } },
            "silver": { "One Size": { quantity: 6, price: 199.99 } }
          }
        },
        {
          id: 6,
          title: "Denim Jacket",
          price: 59.99,
          img: "https://via.placeholder.com/300x300/805ad5/FFFFFF?text=Jacket",
          categories: ["men's clothing"],
          description: "Classic denim jacket for casual wear",
          color: ["blue", "black"],
          size: ["S", "M", "L", "XL"],
          inventory: {
            "blue": { 
              "M": { quantity: 8, price: 59.99 },
              "L": { quantity: 5, price: 59.99 }
            }
          }
        },
        {
          id: 7,
          title: "Wireless Earbuds",
          price: 79.99,
          img: "https://via.placeholder.com/300x300/38a169/FFFFFF?text=Earbuds",
          categories: ["electronics", "audio"],
          description: "Compact wireless earbuds with great sound",
          color: ["white", "black"],
          size: ["One Size"],
          inventory: {
            "white": { "One Size": { quantity: 15, price: 79.99 } },
            "black": { "One Size": { quantity: 10, price: 79.99 } }
          }
        },
        {
          id: 8,
          title: "Sports Backpack",
          price: 45.99,
          img: "https://via.placeholder.com/300x300/e53e3e/FFFFFF?text=Backpack",
          categories: ["accessories"],
          description: "Durable backpack for sports and travel",
          color: ["black", "blue", "red"],
          size: ["One Size"],
          inventory: {
            "black": { "One Size": { quantity: 20, price: 45.99 } },
            "blue": { "One Size": { quantity: 12, price: 45.99 } }
          }
        }
      ];
    };

    fetchProducts();
  }, []);

  // Filter products based on category
  useEffect(() => {
    if (products.length === 0) return;

    let filtered = products.filter((product) => {
      // If no category selected or 'all', show all products
      if (!category || category === "all") return true;

      // Use the existing categories array from your product data
      switch(category) {
        case "men":
          return product.categories.includes("men's clothing");
        case "women":
          return product.categories.includes("jewelery") ||
                 product.categories.includes("women's");
        case "accessories":
          return product.categories.includes("electronics") || 
                 product.categories.includes("jewelery") ||
                 product.categories.includes("accessories");
        case "shoes":
          return product.categories.includes("shoes");
        default:
          return false;
      }
    });

    // Apply additional filters (size, color)
    if (filters.size) {
      filtered = filtered.filter(product => 
        product.size.includes(filters.size)
      );
    }

    if (filters.color) {
      filtered = filtered.filter(product => 
        product.color.includes(filters.color)
      );
    }

    setFilteredProducts(filtered);
  }, [products, category, filters]);

  const handleFilters = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      [e.target.name]: value,
    });
  };

  if (loading) {
    return (
      <Container>
        <Loading>
          <i className="fas fa-spinner fa-spin"></i>
          Loading amazing products...
        </Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{category ? `${category} Products` : "All Products"}</Title>
      
      <FilterContainer>
        <Filter>
          <FilterText>Filter Products:</FilterText>
          <Select name="size" onChange={handleFilters} value={filters.size}>
            <Option value="">All Sizes</Option>
            <Option value="S">Small (S)</Option>
            <Option value="M">Medium (M)</Option>
            <Option value="L">Large (L)</Option>
            <Option value="XL">XL</Option>
            <Option value="XXL">XXL</Option>
            <Option value="One Size">One Size</Option>
          </Select>
          
          <Select name="color" onChange={handleFilters} value={filters.color}>
            <Option value="">All Colors</Option>
            <Option value="black">Black</Option>
            <Option value="white">White</Option>
            <Option value="blue">Blue</Option>
            <Option value="red">Red</Option>
            <Option value="navy">Navy</Option>
            <Option value="gray">Gray</Option>
            <Option value="gold">Gold</Option>
            <Option value="silver">Silver</Option>
            <Option value="rose gold">Rose Gold</Option>
            <Option value="white gold">White Gold</Option>
            <Option value="yellow gold">Yellow Gold</Option>
          </Select>
        </Filter>
      </FilterContainer>

      {/* Use the Products component instead of manual mapping */}
      <Products products={filteredProducts} loading={false} />
    </Container>
  );
};

export default ProductList;