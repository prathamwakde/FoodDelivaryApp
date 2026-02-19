import React, { useState,useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Carousel from "./Components/Carousel/Carousel";
import Menu from "./Components/Menu/Menu";
import Cards from "./Components/Cards/Cards";
import Cart from "./Components/Cart/Cart";
import Orders from "./Components/Orders/Orders";
import Signup from "./Components/AuthForm/Signup";
import Login from "./Components/AuthForm/Login";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoutes";
import { useDispatch } from "react-redux";
import { setCart } from "./Components/redux/cartSlice";
import AdminLayout from "./Components/admin/AdminLayout";

const App = () => {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
    const dispatch = useDispatch();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      dispatch(setCart(savedCart));
    }
  }, [dispatch]);
  return (
    <>
      {!isAdmin && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Carousel />
                <Menu
                  setSelectedCategory={
                    setSelectedCategory
                  }
                />
                <Cards
                  selectedCategory={selectedCategory}
                />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <>
              <Menu
                setSelectedCategory={
                  setSelectedCategory
                }
              />
              <Cards
                selectedCategory={selectedCategory}
              />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/order" element={<Orders />} />
      </Routes>
    </>
  );
};

export default App;
