import React from "react";
import "../styles/Help.css";
import logo from "../assets/logo1.png";
import { Link } from "react-router-dom";

const Help = () => {
  return (
    <div className="help-container">
      <div className="help-content">
        <Link to="/">
          <img src={logo} alt="FlyEase Logo" className="help-logo" />
        </Link>
        <h1>Help & Support</h1>
        <p className="help-description">
          Need assistance? We're here to help! Below are some frequently asked questions and resources to guide you. 
          If you can't find what you're looking for, feel free to contact us.
        </p>
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
          {/* Booking Questions */}
          <div className="faq">
            <h3>How do I book a flight?</h3>
            <p>
              Booking a flight is easy! Simply enter your departure and arrival cities, 
              select your travel dates, and choose from the available flights. Complete your booking
              by entering passenger details and making the payment.
            </p>
          </div>
          
          <div className="faq">
            <h3>Can I book a flight without creating an account?</h3>
            <p>
              No, you can not book flights as a guest. Creating an account allows you to
              manage your bookings, receive special offers, and access your travel history.
            </p>
          </div>
          
          <div className="faq">
            <h3>How far in advance can I book a flight?</h3>
            <p>
              You can book flights up to 11 months in advance. For the best prices and availability,
              we recommend booking at least 3-4 weeks before your travel date.
            </p>
          </div>

          {/* Payment Questions */}
          <div className="faq">
            <h3>What payment methods do you accept?</h3>
            <p>
              We accept all major credit/debit cards, net banking and UPI.
              All transactions are secure and encrypted for your protection.
            </p>
          </div>
          
          <div className="faq">
            <h3>Is it safe to enter my payment details on your website?</h3>
            <p>
              Absolutely! We use industry-standard SSL encryption to protect all your personal and
              payment information. Your data security is our top priority.
            </p>
          </div>

          {/* Cancellation & Changes */}
          <div className="faq">
            <h3>How can I cancel or change my flight?</h3>
            <p>
              You can manage your booking through "Dashboard" in your account or by contacting our
              customer support. Please note that changes/cancellations may be subject to airline policies
              and fees.
            </p>
          </div>
          
          <div className="faq">
            <h3>What is your cancellation policy?</h3>
            <p>
              Cancellation policies vary by airline and fare type. Basic economy tickets are typically
              non-refundable, while other fares may allow cancellations with fees. You'll see the specific
              cancellation terms before completing your booking.
            </p>
          </div>

          {/* Check-in & Boarding */}
          <div className="faq">
            <h3>When can I check in for my flight?</h3>
            <p>
              Online check-in typically opens 48 hours before departure and closes 2 hours before
              domestic flights or 3 hours before international flights. You can check in through
              our website or mobile app.
            </p>
          </div>
          
          <div className="faq">
            <h3>What documents do I need for airport check-in?</h3>
            <p>
              You'll need a valid government-issued photo ID (for domestic flights) or passport (for
              international flights), along with your boarding pass. Some destinations may require
              additional documents like visas or vaccination certificates.
            </p>
          </div>

          {/* Baggage Questions */}
          <div className="faq">
            <h3>What is the baggage allowance?</h3>
            <p>
              Baggage allowances vary by airline and fare class. Typically, economy class includes
              1 cabin bag (7kg) and 1 checked bag (15-23kg). You can view specific baggage allowances
              during the booking process.
            </p>
          </div>

          {/* Special Assistance */}
          <div className="faq">
            <h3>How do I request special assistance?</h3>
            <p>
              You can request wheelchair assistance, special meals, or other needs during booking
              or by contacting our customer support at least 48 hours before your flight.
            </p>
          </div>
          
          <div className="faq">
            <h3>Can I travel with infants or young children?</h3>
            <p>
              Yes! Infants (under 2 years) can travel on your lap at a discounted fare, or you can
              purchase a seat for them. We recommend bringing appropriate child restraint systems
              for safety.
            </p>
          </div>

          {/* Customer Support */}
          <div className="faq">
            <h3>How do I contact customer support?</h3>
            <p>
              You can reach our 24/7 customer support team via:
              <br />- Email: support@flyease.com
              <br />- Phone: +91 8274828419 (8AM-10PM IST)
              <br />- Live Chat: Available on our website and mobile app
            </p>
          </div>
          
          <div className="faq">
            <h3>What are your customer support hours?</h3>
            <p>
              Our customer support is available 24/7 via email and live chat. Phone support is
              available from 8AM to 10PM IST daily, including weekends and holidays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;