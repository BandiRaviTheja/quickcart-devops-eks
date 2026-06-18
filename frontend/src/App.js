import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import ProductList from "./pages/ProductList";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses"; // ADD THIS IMPORT
import Success from "./pages/Success";
import Orders from "./pages/Orders";
import SearchResults from "./pages/SearchResults";
import Footer from "./components/Footer";

// NEW ADMIN COMPONENTS
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/Products";
import AdminOrders from "./admin/pages/Orders";
import AdminUsers from "./admin/pages/Users";

// Customer route protection component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Admin route protection component
const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  return adminToken ? children : <Navigate to="/admin/login" />;
};

// Layout component for customer routes (with Navbar & Footer)
const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

// Layout component for admin routes (without Navbar & Footer)
const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    {children}
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* CUSTOMER ROUTES (with Navbar & Footer) */}
        <Route path="/" element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        } />
        <Route path="/products/:category" element={
          <CustomerLayout>
            <ProductList />
          </CustomerLayout>
        } />
        <Route path="/product/:id" element={
          <CustomerLayout>
            <ProductPage />
          </CustomerLayout>
        } />
        <Route path="/cart" element={
          <CustomerLayout>
            <CartPage />
          </CustomerLayout>
        } />
        <Route path="/login" element={
          <CustomerLayout>
            <Login />
          </CustomerLayout>
        } />
        <Route path="/register" element={
          <CustomerLayout>
            <Register />
          </CustomerLayout>
        } />
        <Route path="/search" element={
          <CustomerLayout>
            <SearchResults />
          </CustomerLayout>
        } />
        
        {/* PROTECTED CUSTOMER ROUTES */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <CustomerLayout>
              <Profile />
            </CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/addresses" element={
          <ProtectedRoute>
            <CustomerLayout>
              <Addresses />
            </CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/success" element={
          <ProtectedRoute>
            <CustomerLayout>
              <Success />
            </CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <CustomerLayout>
              <Orders />
            </CustomerLayout>
          </ProtectedRoute>
        } />

        {/* ADMIN ROUTES (without Navbar & Footer) */}
        <Route path="/admin/login" element={
          <AdminLayout>
            <AdminLogin />
          </AdminLayout>
        } />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminRoute>
        } />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;