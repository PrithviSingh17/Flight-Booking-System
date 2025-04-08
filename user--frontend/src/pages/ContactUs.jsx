import React from "react";
import "../styles/ContactUs.css";
import logo from "../assets/logo1.png";
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <div className="contact-us-content">
        <Link to="/">
          <img src={logo} alt="FlyEase Logo" className="contact-us-logo" />
        </Link>
        <h1>Contact Us</h1>
        <p className="contact-us-description">
          We'd love to hear from you! Whether you have a question, feedback, or need assistance, 
          our team is here to help. Reach out to us using the form below or through our contact details.
        </p>
        <div className="contact-us-details">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> support@flyease.com</p>
            <p><strong>Phone:</strong> +91 8274828419</p>
            <p><strong>Address:</strong> 123 FlyEase Lane, Mumbai, India</p>
          </div>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;