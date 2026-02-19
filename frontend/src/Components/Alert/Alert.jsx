import React from "react";
import "../Alert/Alert.css";

const CustomAlert = ({ message, type = "info", show }) => {
  if (!show) return null;

  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
};

export default CustomAlert;
