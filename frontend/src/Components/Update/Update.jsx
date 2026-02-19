import React, { useState } from "react";

const Update = ({ food }) => {
  const [updatedFood, setUpdatedFood] = useState(food);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:8000/api/food/updatefood/${food._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token
        },
        body: JSON.stringify(updatedFood)
      }
    );

    alert("Food Updated");
  };

  return (
    <button onClick={handleUpdate}>Update</button>
  );
};

export default Update;
