import React, { useEffect, useState } from "react";
import "../pages/Orders.css";
import CustomAlert from "../../Alert/Alert";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  // ===== ALERT =====
  const showCustomAlert = (message, type) => {
    setAlertMsg(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  // ===== FETCH ORDERS =====
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showCustomAlert("Please login first", "warning");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "http://localhost:8000/api/order/myorders",
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        showCustomAlert("Failed to fetch orders", "error");
      }
    } catch (error) {
      console.log("Fetch Error:", error);
      showCustomAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===== DELETE ORDER =====
  const handleDeleteOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/order/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": token,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.filter((order) => order._id !== id)
        );

        showCustomAlert("Order removed ❌", "warning");
      } else {
        showCustomAlert("Delete failed", "error");
      }
    } catch (error) {
      showCustomAlert("Server error", "error");
    }
  };

  return (
    <>
      <CustomAlert
        message={alertMsg}
        type={alertType}
        show={showAlert}
      />

      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No Orders Found</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>

              <div className="order-main">
                <img
                  src={order.items?.[0]?.image || "/images/placeholder.png"}
                  alt="food"
                />


                <h4>
                  {order.items?.map((item) => item.title).join(", ")}
                </h4>

                <span>{order.orderStatus}</span>
              </div>

              <p>{order.shippingAddress?.fullName}</p>

              <p>
                {order.shippingAddress?.address},{" "}
                {order.shippingAddress?.city}
              </p>

              <p>📞 {order.shippingAddress?.phone}</p>

              <p>Total Amount: ₹{order.totalAmount}</p>

              {order.items?.map((item) => (
                <p key={item._id}>
                  {item.title} × {item.quantity}
                </p>
              ))}

              <button
                className="delete-order-btn"
                onClick={() =>
                  handleDeleteOrder(order._id)
                }
              >
                Remove Order
              </button>

            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Orders;
