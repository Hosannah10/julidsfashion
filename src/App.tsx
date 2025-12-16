import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CustomOrderForm from "./pages/CustomOrderForm";
import CustomOrders from "./pages/CustomOrders";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ShopOrders from "./pages/ShopOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


const App: React.FC = () => {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={
            <ProtectedRoute>
            <Cart />
            </ProtectedRoute>
            } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/shop-orders" element={
            <ProtectedRoute>
              <ShopOrders />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/custom-order-form" element={
            <ProtectedRoute>
            <CustomOrderForm />
            </ProtectedRoute>
            } />
          <Route path="/custom-orders" element={<CustomOrders/>} />
        </Routes>
      </main>
    </>
  );
};

export default App;
