import React from "react";
import "../admin/AdminNavbar.css";
const AdminNavbar = () => {
  return (
    <div className="admin-navbar">
      <img src="/images/logo.png" alt="logo" />

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
