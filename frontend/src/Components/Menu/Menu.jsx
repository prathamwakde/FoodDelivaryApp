import React from 'react'
import "../Menu/Menu.css";
const Menu = ({ setSelectedCategory }) => {
  return (
    <div>
      <div className="menu-heading"><h1>Explore Favorite Dishes</h1></div>
      <div className="filter-continer">
        <button className='filter-btn' onClick={() => setSelectedCategory("All")}>
          <img src="./images/all.png" alt="" />
          <span>ALL MENUS</span>
        </button>
        <button className='filter-btn' onClick={() => setSelectedCategory("Pizza")}>
          <img src="./images/pizza.png" alt="" />
          <span>PIZZA</span>
        </button>
        <button className='filter-btn' onClick={() => setSelectedCategory("Pasta")}>
          <img src="./images/pasta.png" alt="" />
          <span>PASTA</span>
        </button>
        <button className='filter-btn' onClick={() => setSelectedCategory("Burger")}>
          <img src="./images/burger.png" alt="" />
          <span>BURGER</span>
        </button>
        <button
          className='filter-btn'
          onClick={() => setSelectedCategory("Sandwich")}
        >
          <img src="./images/sandwitch.png" alt="" />
          <span>SANDWICH</span>
        </button>

        <button
          className='filter-btn'
          onClick={() => setSelectedCategory("Noodles")}
        >
          <img src="./images/noddles.png" alt="" />
          <span>NOODLES</span>
        </button>

        <button className='filter-btn' onClick={() => setSelectedCategory("Manchurian")}>
          <img src="./images/manchurian.png" alt="" />
          <span>MANCHURIAN</span>
        </button>
      </div>
    </div>
  )
}

export default Menu;