import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeItem,
} from "../redux/cartSlice";
import "../Cart/Cart.css";
import CustomAlert from "../Alert/Alert";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // ================= ALERT =================
  const showCustomAlert = (message, type) => {
    setAlertMsg(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  // ================= REMOVE ITEM =================
  const handleRemove = (foodId, title) => {
    dispatch(removeItem(foodId));
    showCustomAlert(`${title} removed from cart!`, "warning");
  };

  // ================= CHECKOUT =================
 const handleCheckout = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      showCustomAlert("Login first", "error");
      return;
    }

    // Define order data
    const orderData = {
      items: cartItems.map((item) => ({
        food: item.foodId,
        title: item.title,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice + 40,
      shippingAddress: {
        fullName: "Test User", 
        phone: "9999999999", 
        address: "Nagpur",     
        city: "Nagpur",        
        pincode: "440001",     
      },
    };

    const res = await fetch("http://localhost:8000/api/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token, // This must match backend's expected header
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (data.success) {
      showCustomAlert("Order placed ✅", "success");
      // Optionally, you can clear the cart or redirect here
    } else {
      showCustomAlert(data.message || "Order failed", "error");
    }
  } catch (error) {
    console.error("Checkout Error:", error);
    showCustomAlert("Server Error", "error");
  }
};

  // ================= UI =================
  return (
    <>
      <CustomAlert
        message={alertMsg}
        type={alertType}
        show={showAlert}
      />

      <div className="cart-container">
        <div className="cart-left">
          <h2 className="cart-title">Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="empty-cart">
              Your cart is empty
              <img
                src="./images/empty-bag.png"
                alt="empty-cart"
                className="empty-bag"
              />
            </p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.foodId}>
                <img src={item.image} alt={item.title} />

                <div className="cart-details">
                  <h3>{item.title}</h3>
                  <p>₹ {item.price}</p>

                  <div className="quantity-box">
                    <button
                      onClick={() =>
                        dispatch(decreaseQuantity(item.foodId))
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(increaseQuantity(item.foodId))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-right">
                  <h4>₹ {item.price * item.quantity}</h4>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      handleRemove(item.foodId, item.title)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <h3>Bill Details</h3>

          <div className="summary-row">
            <span>Item Total</span>
            <span>₹ {totalPrice}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹ 40</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>₹ {totalPrice + 40}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed To Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
