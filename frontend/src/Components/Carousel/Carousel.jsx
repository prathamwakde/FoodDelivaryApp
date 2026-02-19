import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "../Carousel/Carousel.css";
const HeroCarousel = () => {
  return (
    <div className="app-container">
      <div className="carousel-card">
        <Carousel
          autoPlay
          infiniteLoop
          interval={3000}
          showThumbs={false}
          showStatus={false}
          swipeable
          emulateTouch
          stopOnHover
          showArrows={false}
        >
          {/* Slide 1 */}
          <div className="slide">
            <img src="/images/SpicyPizza.png" alt="Spicy Pizza" />
            <div className="overlay-gradient">
              <div className="text-content">
                <span className="offer-badge">50% OFF</span>
                <h2>Spicy Pizza</h2>
                <p>Hot and cheesy pizza with extra topping</p>
                <button className="buy-now">Buy Now</button>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="slide">
            <img src="/images/JuicyBurgar.png" alt="Juicy Burger" />
            <div className="overlay-gradient">
              <div className="text-content">
                <span className="offer-badge">30% OFF</span>
                <h2>Juicy Burger</h2>
                <p>Fresh and juicy burger with crispy fries</p>
                <button className="buy-now">Buy Now</button>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="slide">
            <img src="/images/SpicyPasta.png" alt="Spicy Pasta" />
            <div className="overlay-gradient">
              <div className="text-content">
                <span className="offer-badge">20% OFF</span>
                <h2>Spicy Pasta</h2>
                <p>Italian pasta with spicy sauce</p>
                <button className="buy-now">Buy Now</button>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default HeroCarousel;
