import React from "react";
import "../styles/Home.css"; // Import the styles

// Import local images
import MumbaiImage from "../assets/Mumbai.jpg";
import DelhiImage from "../assets/Delhi.jpg";
import BangaloreImage from "../assets/Bangalore.webp";
import JaipurImage from "../assets/Jaipur.jpg";
import ChennaiImage from "../assets/Chennai.jpg";
import LucknowImage from "../assets/Ayodhya.jpg";

const IndianCitiesCarousel = () => {
  const cities = [
    {
      name: "Mumbai",
      image: MumbaiImage, // Use local image
    },
    {
      name: "Delhi",
      image: DelhiImage, // Use local image
    },
    {
      name: "Bangalore",
      image: BangaloreImage, // Use local image
    },
    {
      name: "Jaipur",
      image: JaipurImage, // Use local image
    },
    {
      name: "Chennai",
      image: ChennaiImage, // Use local image
    },
    {
      name: "Lucknow",
      image: LucknowImage, // Use local image
    },
  ];

  return (
    <div className="indian-cities-carousel">
      <h2>Explore Indian Cities</h2>
      <div className="cities-grid">
        {cities.map((city, index) => (
          <div key={index} className="city-card">
            <div className="city-image">
              <img src={city.image} alt={city.name} />
            </div>
            <div className="city-name">{city.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndianCitiesCarousel;