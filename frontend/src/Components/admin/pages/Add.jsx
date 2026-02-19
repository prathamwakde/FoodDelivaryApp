import React, { useState } from "react";
import "../pages/Add.css";

const Add = () => {
  const [food, setFood] = useState({
    title: "",
    description: "",
    price: "",
    category: "Pizza",
    image: "",
  });

  // handle input change
  const onChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  // submit form
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // check login
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/food/addfood",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },

          body: JSON.stringify({
            ...food,
            price: Number(food.price), // convert price to number
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Food Added Successfully");

        // reset form
        setFood({
          title: "",
          description: "",
          price: "",
          category: "Pizza",
          image: "",
        });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error adding food:", error);
      alert("Server Error");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>

        <input
          type="text"
          placeholder="Image URL"
          name="image"
          value={food.image}
          onChange={onChange}
          required
        />

        <input
          type="text"
          placeholder="Product name"
          name="title"
          value={food.title}
          onChange={onChange}
          required
        />

        <textarea
          placeholder="Description"
          name="description"
          value={food.description}
          onChange={onChange}
          required
        />

        <select
          name="category"
          value={food.category}
          onChange={onChange}
        >
          <option value="Pizza">Pizza</option>
          <option value="Burger">Burger</option>
          <option value="Pasta">Pasta</option>
          <option value="Sandwich">Sandwich</option>
          <option value="Noodles">Noodles</option>
          <option value="Manchurian">Manchurian</option>
        </select>

        <input
          type="number"
          placeholder="Price"
          name="price"
          value={food.price}
          onChange={onChange}
          required
        />

        <button type="submit" className="add-btn">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
