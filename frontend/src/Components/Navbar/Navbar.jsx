import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/menu?search=${searchTerm}`);
  };

  const cartItems = useSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <div className="navbar">
      <div className="navbar-continer">
        <img src="/images/logo.png" alt="logo" className="logo" />

        <div className="navbar-menus">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/menu">MENUS</Link></li>
          <li><Link to="/order">ORDERS</Link></li>
        </div>

        <div className="search-continer">
          <input
            type="text"
            placeholder="Enter the food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            <i className="bi bi-search"></i>
          </button>
        </div>

        <div className="auth-container">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          ) : (
            <Link to="/signup" className="signup-button">
              Signup
            </Link>
          )}
        </div>

        <div className="navbar-icons">
          <Link to="/cart" className="navbar-items">
            <i className="bi bi-bag"></i>
            <h6>Cart</h6>
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
