import React, { useEffect, useState } from "react";
import "../pages/List.css";

const List = () => {
  const [foods, setFoods] = useState([]);

  const fetchFoods = async () => {
    const res = await fetch("http://localhost:8000/api/food/getfood");
    const data = await res.json();
    setFoods(data.foods);
  };

  useEffect(() => {
    fetchFoods();
  }, []);


  const deleteFood = async (id) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch(
      `http://localhost:8000/api/food/deletefood/${id}`,
      {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Food Deleted Successfully");
      fetchFoods();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="list">
      <p>All Foods List</p>

      <div className="list-table">
        <div className="list-table-fromat title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {foods.map((food) => (
          <div className="list-table-fromat" key={food._id}>
            <img src={food.image} alt="" width="50" />
            <p>{food.title}</p>
            <p>{food.category}</p>
            <p>₹{food.price}</p>
            <button className="cursor" onClick={() => deleteFood(food._id)}>
              <i
                className="bi bi-x-circle"
                style={{ width: "100%", color: "red" }}
              ></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
