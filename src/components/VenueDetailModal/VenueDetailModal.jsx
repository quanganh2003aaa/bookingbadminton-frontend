import React, { useMemo, useState } from "react";
import { FiClock, FiMapPin, FiPhone, FiStar } from "react-icons/fi";
import "./venueDetailModal.css";

const TABS = [
  { key: "images", label: "Hình ảnh" },
  { key: "pricing", label: "Giá sân" },
  { key: "map", label: "Bản đồ" },
  { key: "reviews", label: "Đánh giá" },
];

export default function VenueDetailModal({ venue, onClose, onBook }) {
  const [activeTab, setActiveTab] = useState("images");
  if (!venue) return null;

  const {
    name,
    address,
    startTime,
    endTime,
    phone,
    image,
    mapEmbed,
    images = [],
    pricing = [],
    reviews = [],
  } = venue;

  const displayImages = useMemo(
    () => (images.length ? images : [image]),
    [images, image]
  );

  return (
    <div className="venue-modal-backdrop" onClick={onClose}>
      <div
        className="venue-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="venue-modal-hero">
          <img src={displayImages[0]} alt={name} />
        </div>

        <div className="venue-modal-body">
          <div className="venue-header">
            <div className="venue-header-left">
              <div className="venue-avatar">
                <img src={image} alt={name} />
              </div>
              <div className="venue-title-block">
                <h3>{name}</h3>
                <div className="venue-meta-row">
                  <FiMapPin />
                  <span>{address}</span>
                </div>
                <div className="venue-meta-inline">
                  <div className="venue-meta-row">
                    <FiClock />
                    <span>
                      {startTime} - {endTime}
                    </span>
                  </div>
                  <div className="venue-meta-row">
                    <FiPhone />
                    <span>{phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="venue-book-btn"
              type="button"
              onClick={() => onBook && onBook()}
            >
              Đặt lịch &gt;&gt;&gt;
            </button>
          </div>

          <div className="venue-rating-pill">
            <FiStar />
            <span>4.5 (15 đánh giá)</span>
          </div>

          <div className="venue-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`venue-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="venue-tab-content">
            {activeTab === "images" && (
              <div className="images-scroll">
                {displayImages.map((src, idx) => (
                  <div key={src + idx} className="image-thumb">
                    <img src={src} alt={`${name} ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "pricing" && (
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th>Khung giờ</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.map((row, idx) => (
                    <tr key={row.time + idx}>
                      <td>{row.time}</td>
                      <td>{Number(row.price).toLocaleString("vi-VN")} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "map" && (
              <div className="map-embed">
                {mapEmbed ? (
                  <iframe
                    src={mapEmbed}
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bản đồ"
                  />
                ) : (
                  <div className="placeholder-panel">
                    <span>Bản đồ đang cập nhật</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="reviews-list">
                {reviews.map((r) => (
                  <div key={r.id} className="review-item">
                    <div className="review-avatar">
                      {r.avatar ? (
                        <img src={r.avatar} alt={r.name} />
                      ) : (
                        <span>{r.name?.charAt(0) || "?"}</span>
                      )}
                    </div>
                    <div className="review-body">
                      <div className="review-header">
                        <span className="review-name">{r.name}</span>
                        <span className="review-stars">
                          {"★".repeat(r.rating || 0)}
                          {"☆".repeat(Math.max(0, 5 - (r.rating || 0)))}
                        </span>
                      </div>
                      <div className="review-comment">{r.comment}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="venue-close" type="button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}
