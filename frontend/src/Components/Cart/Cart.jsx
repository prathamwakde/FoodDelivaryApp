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
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
  const createFoodOrder = async (token) => {
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
    } else {
      throw new Error(data.message || "Order failed");
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showCustomAlert("Login first", "error");
      return;
    }

    if (!window.Razorpay) {
      showCustomAlert("Payment service is unavailable", "error");
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderResponse = await fetch("http://localhost:8000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round((totalPrice + 40) * 100),
          currency: "INR",
        }),
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.message || "Unable to start payment");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Food Delivary App",
        description: "Food order payment",
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(
              "http://localhost:8000/api/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );
            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.message || "Payment verification failed");
            }

            await createFoodOrder(token);
          } catch (error) {
            console.error("Payment verification error:", error);
            showCustomAlert(error.message || "Payment verification failed", "error");
          } finally {
            setIsCheckingOut(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsCheckingOut(false);
            showCustomAlert("Payment cancelled", "warning");
          },
        },
        theme: { color: "#ff6347" },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.on("payment.failed", (response) => {
        setIsCheckingOut(false);
        showCustomAlert(
          response.error?.description || "Payment failed",
          "error"
        );
      });
      paymentWindow.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      setIsCheckingOut(false);
      showCustomAlert(error.message || "Server Error", "error");
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

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={isCheckingOut || cartItems.length === 0}
          >
            {isCheckingOut ? "Processing..." : "Proceed To Checkout"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
