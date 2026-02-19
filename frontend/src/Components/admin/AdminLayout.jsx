import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavbar from "../admin/AdminNavbar";
import Sidebar from "../admin/Slidebar";
import "../admin/AdminLayout.css";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";



const AdminLayout = () => {
  return (
    <div className="admin-panel">

      <AdminNavbar />

      <div className="admin-body">

        <Sidebar />

        <div className="admin-content">
          <Routes>
            <Route path="add" element={<Add />} />
            <Route path="list" element={<List />} />
            <Route path="orders" element={<Orders />} />
          </Routes>
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;
