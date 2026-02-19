import React, { useEffect, useState } from "react";
import "../Orders/Orders.css";
import CustomAlert from "../Alert/Alert";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/order/myorders", {
      headers: {
        "auth-token": token,
      },
    });

    const data = await res.json();

    if (data.success) {
      setOrders(data.orders);
      showCustomAlert("Orders Added successfully ✅", "success");
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/api/order/delete/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": token,
      },
    });

    const data = await res.json();

    if (data.success) {
      setOrders((prev) => prev.filter((order) => order._id !== id));
      showCustomAlert("Order removed successfully ❌", "warning");

      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } else {
      showCustomAlert(data.message, "error");

      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };
  const showCustomAlert = (message, type) => {
    setAlertMsg(message);
    setAlertType(type);
    setShowAlert(true);
  };
  return (
    <>
      <CustomAlert message={alertMsg} type={alertType} show={showAlert} />
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>
        {orders.map((order) => (
          <React.Fragment key={order._id}>
            <div className="order-card">
              <div className="order-top">
                <img
                  src={
                    order.foodImage
                      ? order.foodImage
                      : order.items[0]?.food?.image
                  }
                  alt={order.foodName}
                  className="order-image"
                />

                <span>{order.orderStatus}</span>
              </div>

              <p>Total Amount: ₹{order.totalAmount}</p>

              {order.items?.map((item) => (
                <p key={item._id}>
                  {item.food?.title} x {item.quantity}
                </p>
              ))}
            </div>
            <button
              className="delete-order-btn"
              onClick={() => handleDeleteOrder(order._id)}
            >
              Remove Order
            </button>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default Orders;
