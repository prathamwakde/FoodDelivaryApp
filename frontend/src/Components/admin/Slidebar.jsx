import React from "react";
import { Link } from "react-router-dom";
import "../admin/Sliderbar.css";
const Sidebar = () => {
  return (
    <div className="sidebar">

      <Link to="/admin/list">
        <button><img src="../images/list.png" alt=""  className="admin-icon"/>Product List</button>
      </Link>

      <Link to="/admin/add">
        <button><img src="../images/plus.png" alt="" className="admin-icon"/>Add Product</button>
      </Link>

      <Link to="/admin/orders">
        <button><img src="../images/order.png" alt="" className="admin-icon"/>Orders</button>
      </Link>

    </div>
  );
};

export default Sidebar;
