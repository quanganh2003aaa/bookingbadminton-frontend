import React from "react";
import "./venueCard.css";
import { FiMapPin, FiClock, FiPhone } from "react-icons/fi";

export default function VenueCard({ venue }) {
  const { logo, name, address, phone, startTime, endTime, image } = venue;

  return (
    <div className="venue-card">
      <div className="venue-card-image">
        <img src={image} alt={name} />
      </div>

      <div className="venue-card-body">
        <div className="venue-card-main">
          <div className="venue-card-avatar">
            <img src={logo} alt={name} />
          </div>

          <div className="venue-card-details">
            <h3 className="venue-card-title">{name}</h3>

            <div className="venue-card-meta">
              <div className="meta-row">
                <FiMapPin className="meta-icon" />
                <span className="meta-text">{address}</span>
              </div>

              <div className="meta-inline">
                <div className="meta-row">
                  <FiClock className="meta-icon" />
                  <span className="meta-text">
                    {startTime} - {endTime}
                  </span>
                </div>
                <div className="meta-row">
                  <FiPhone className="meta-icon" />
                  <span className="meta-text">{phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="btn-booking" type="button">
          ĐẶT LỊCH
        </button>
      </div>
    </div>
  );
}
