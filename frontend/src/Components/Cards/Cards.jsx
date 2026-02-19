import React, { useState, useEffect } from "react";
import "../Cards/Cards.css";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";
import CustomAlert from "../Alert/Alert";
import { useLocation } from "react-router-dom";

const Cards = ({ selectedCategory }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  const dispatch = useDispatch();
  const location = useLocation();

  // ================= FETCH FOODS =================
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchTerm = query.get("search");

    fetchFoods(searchTerm);
  }, [location.search]);

  const fetchFoods = async (searchTerm = null) => {
    try {
      setLoading(true);

      const url = searchTerm
        ? `http://localhost:8000/api/food/search?q=${encodeURIComponent(
            searchTerm
          )}`
        : "http://localhost:8000/api/food/getfood";

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && Array.isArray(data.foods)) {
        setFoods(data.foods);
      } else {
        setFoods([]);
      }
    } catch (error) {
      console.error("Fetch foods error:", error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= CATEGORY FILTER =================
  const filteredFoods =
    !selectedCategory || selectedCategory.toLowerCase() === "all"
      ? foods
      : foods.filter(
          (food) =>
            food.category?.trim().toLowerCase() ===
            selectedCategory?.trim().toLowerCase()
        );

  // ================= ALERT =================
  const showCustomAlert = (message, type) => {
    setAlertMsg(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => setShowAlert(false), 2000);
  };

  // ================= ADD TO CART =================
  const handleAddToCart = async (food) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showCustomAlert("Please login first", "warning");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/cart/addcart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            foodId: food._id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(
          addItem({
            foodId: food._id,
            title: food.title,
            image: food.image,
            price: food.price,
            quantity: 1,
          })
        );

        showCustomAlert("Added to cart ✅", "success");
      } else {
        showCustomAlert(data.message || "Failed to add", "error");
      }
    } catch (error) {
      console.error(error);
      showCustomAlert("Something went wrong", "error");
    }
  };

  // ================= UI =================
  return (
    <>
      <CustomAlert message={alertMsg} type={alertType} show={showAlert} />

      <div className="cards-container">

        {loading ? (
          <p>Loading foods...</p>
        ) : filteredFoods.length === 0 ? (
          <p>No food found</p>
        ) : (
          filteredFoods.map((food) => (
            <div className="product-card" key={food._id}>
              <div className="product-category">{food.category}</div>

              <img src={food.image} alt={food.title} />

              <div className="product-detail">
                <h3 className="product-title">{food.title}</h3>
                <p className="product-description">{food.description}</p>
                <div className="product-footer">
                  <span className="product-price">₹{food.price}</span>

                  <button
                    className="add-to-cart"
                    onClick={() => handleAddToCart(food)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </>
  );
};

export default Cards;
