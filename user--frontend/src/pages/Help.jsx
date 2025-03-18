import React from "react";
import "../styles/Help.css";
import logo from "../assets/logo1.png"; // Import your logo

const Help = () => {
  return (
    <div className="help-container">
      <div className="help-content">
        <img src={logo} alt="FlyEase Logo" className="help-logo" />
        <h1>Help & Support</h1>
        <p className="help-description">
          Need assistance? We're here to help! Below are some frequently asked questions and resources to guide you. If you can't find what you're looking for, feel free to contact us.
        </p>
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq">
            <h3>How do I book a flight?</h3>
            <p>
              Booking a flight is easy! Simply enter your departure and arrival cities, select your travel dates, and choose from the available flights.
            </p>
          </div>
          <div className="faq">
            <h3>How do I contact customer support?</h3>
            <p>
              You can reach our customer support team via email at support@flyease.com or by calling +91 8274828419
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;