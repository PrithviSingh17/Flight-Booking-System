import React from "react";
import "../styles/AboutUs.css";
import logo from "../assets/logo1.png";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <Link to="/">
          <img src={logo} alt="FlyEase Logo" className="about-us-logo" />
        </Link>
        <h1>About Us</h1>
        <p className="about-us-description">
          Welcome to <strong>FlyEase</strong>, your trusted partner in air travel. 
          We are dedicated to making your journey seamless, comfortable, and memorable. 
          With years of experience in the aviation industry, we strive to provide the best services to our customers.
        </p>
        <div className="about-us-features">
          <div className="feature">
            <h2>Our Mission</h2>
            <p>
              Our mission is to provide affordable, reliable, and efficient air travel solutions to our customers. 
              We aim to connect people and places, making the world a smaller and more accessible place.
            </p>
          </div>
          <div className="feature">
            <h2>Our Vision</h2>
            <p>
              We envision a future where air travel is accessible to everyone, 
              regardless of their location or budget. We are committed to innovation 
              and sustainability in the aviation industry.
            </p>
          </div>
          <div className="feature">
            <h2>Our Values</h2>
            <p>
              At FlyEase, we value <strong>customer satisfaction</strong>, <strong>safety</strong>, 
              and <strong>innovation</strong>. These principles guide everything we do, 
              from booking your ticket to ensuring a smooth journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;