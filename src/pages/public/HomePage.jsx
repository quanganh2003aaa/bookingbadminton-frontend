import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import VenueCard from "../../components/venue/VenueCard/VenueCard";
import VenueDetailModal from "../../components/venue/VenueDetailModal/VenueDetailModal";
import Loading from "../../components/common/Loading";
import { getAllVenues, getVenueDetail } from "../../services/venueService";
import { mockVenues } from "../../services/mockData";
import avatar from "../../assets/logoV1.png";
import "./homePage.css";

const USE_MOCK_DATA = false;
const PAGE_SIZE = 9;

const API_HOST = (import.meta.env?.VITE_API_BASE || "")
  .replace(/\/api$/, "")
  .replace(/\/$/, "");

const CLIENT_ORIGIN =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "";

const withBase = (path = "") => {
  const base = CLIENT_ORIGIN || API_HOST || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

const normalizeImageSrc = (value = "") => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  const normalized = value.replace(/\\\\/g, "/").replace(/\\/g, "/");
  const lower = normalized.toLowerCase();

  const uploadIdx = lower.lastIndexOf("/upload/");
  if (uploadIdx !== -1) {
    const rel = normalized.slice(uploadIdx);
    return encodeURI(withBase(rel.startsWith("/") ? rel : `/${rel}`));
  }

  const publicIdx = lower.lastIndexOf("/public/");
  if (publicIdx !== -1) {
    const rel = normalized.slice(publicIdx + "/public".length);
    return encodeURI(withBase(rel.startsWith("/") ? rel : `/${rel}`));
  }

  if (normalized.startsWith("/")) return encodeURI(withBase(normalized));
  return encodeURI(withBase(`/${normalized}`));
};

const toHour = (value = "") => {
  const parts = String(value).split(":");
  if (parts.length >= 2) return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  return value;
};

const DEFAULT_IMAGE = "/venues/37baef48823fbeff66b7f4c79d9769b6.jpg";

const mapVenueFromApi = (item = {}) => {
  const image =
    normalizeImageSrc(item.image || item.thumbnail || item.banner) ||
    DEFAULT_IMAGE;

  const images = Array.isArray(item.images)
    ? item.images
        .map((img) => normalizeImageSrc(img?.url || img?.path || img))
        .filter(Boolean)
    : [];

  return {
    id: item.id || item.fieldId || String(Math.random()),
    logo: normalizeImageSrc(item.logo) || image || avatar,
    name: item.name || "Chua dat ten",
    address: item.address || "",
    phone: item.mobileContact || item.contact || "",
    startTime: toHour(item.startTime || ""),
    endTime: toHour(item.endTime || ""),
    image,
    mapEmbed: item.linkMap || item.mapEmbed || "",
    images: images.length ? images : image ? [image] : [],
    pricing: [],
    reviews: [],
  };
};

export default function HomePage() {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPage = useCallback(async (targetPage) => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        const start = (targetPage - 1) * PAGE_SIZE;
        const next = mockVenues.slice(start, start + PAGE_SIZE);
        setVenues(next);
        setTotalElements(mockVenues.length);
        setTotalPages(Math.max(1, Math.ceil(mockVenues.length / PAGE_SIZE)));
        return;
      }

      const data = await getAllVenues({
        page: targetPage,
        pageSize: PAGE_SIZE,
        active: "ACTIVE",
      });

      const payload = data?.result || {};
      const list = Array.isArray(payload.content) ? payload.content : [];
      const mapped = list.map(mapVenueFromApi);
      const totalPagesRaw = Number(payload.totalPages);
      const totalElementsRaw = Number(payload.totalElements);
      const serverTotalPages =
        Number.isFinite(totalPagesRaw) && totalPagesRaw > 0
          ? Math.floor(totalPagesRaw)
          : 1;

      setVenues(mapped);
      setTotalPages(serverTotalPages);
      setTotalElements(
        Number.isFinite(totalElementsRaw)
          ? Math.floor(totalElementsRaw)
          : mapped.length
      );
    } catch (err) {
      console.error("Failed to load venues:", err);
      setError("Khong the tai danh sach san. Vui long thu lai.");
      setVenues([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    const handler = (e) => {
      setSearchTerm(e.detail?.query || "");
    };

    window.addEventListener("venue-search", handler);
    return () => window.removeEventListener("venue-search", handler);
  }, []);

  const displayedVenues = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let list = venues;

    if (q) {
      list = venues.filter((v) => v.name?.toLowerCase().includes(q));
    }

    if (list.length && typeof list[0]?.rating !== "undefined") {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [venues, searchTerm]);

  const handlePageChange = useCallback(
    (nextPage) => {
      if (loading) return;
      if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;

      setPage(nextPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [loading, page, totalPages]
  );

  const pageList = useMemo(() => {
    const MAX_VISIBLE = 5;

    if (totalPages <= MAX_VISIBLE) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const half = Math.floor(MAX_VISIBLE / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + MAX_VISIBLE - 1);

    if (end - start + 1 < MAX_VISIBLE) {
      start = Math.max(1, end - MAX_VISIBLE + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  }, [page, totalPages]);

  const showLeadingEllipsis = pageList.length > 0 && pageList[0] > 2;
  const showTrailingEllipsis =
    pageList.length > 0 && pageList[pageList.length - 1] < totalPages - 1;
  const hasPagination = totalPages >= 1 && (venues.length > 0 || loading);

  const isInitialLoading = page === 1 && loading && venues.length === 0;

  if (isInitialLoading) {
    return <Loading />;
  }

  return (
    <div className="home-page">
      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <div className="venues-grid">
          {displayedVenues.length > 0 ? (
            displayedVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onBook={() =>
                  navigate(`/booking?fieldId=${encodeURIComponent(venue.id || "")}`)
                }
                onSelect={(v) => {
                  setSelectedVenue(v);
                  (async () => {
                    setDetailLoading(true);
                    try {
                      const res = await getVenueDetail(v.id);
                      const payload = res?.result || res || {};
                      const mapped = mapVenueFromApi(payload);

                      mapped.pricing = Array.isArray(payload.timeSlots)
                        ? payload.timeSlots.map((slot, idx) => ({
                            time: `${toHour(slot.startHour)} - ${toHour(slot.endHour)}`,
                            price: slot.price,
                            id: slot.id || idx,
                          }))
                        : [];

                      mapped.reviews = Array.isArray(payload.comments)
                        ? payload.comments.map((c, idx) => ({
                            id: c.id || idx,
                            name: c.userName || c.name || "Khach",
                            rating: c.rating ?? 0,
                            comment: c.comment || c.content || "",
                          }))
                        : [];

                      mapped.images =
                        Array.isArray(payload.images) && payload.images.length
                          ? payload.images
                              .map((img) => normalizeImageSrc(img?.url || img?.path || img))
                              .filter(Boolean)
                          : mapped.images;

                      setSelectedVenue(mapped);
                    } catch (err) {
                      console.error("Failed to load venue detail:", err);
                      setError("Khong the tai chi tiet san. Vui long thu lai.");
                    } finally {
                      setDetailLoading(false);
                    }
                  })();
                }}
              />
            ))
          ) : (
            <div className="no-venues">Khong tim thay san nao</div>
          )}
        </div>

        {loading && venues.length > 0 && (
          <div className="loading-more">Dang tai danh sach san...</div>
        )}

        {hasPagination && (
          <div className="venues-pagination-wrap">
            <div className="venues-pagination">
              <button
                type="button"
                className="pagination-btn nav"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
              >
                Truoc
              </button>

              {pageList[0] > 1 && (
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              )}

              {showLeadingEllipsis && <span className="pagination-ellipsis">...</span>}

              {pageList.map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`pagination-btn ${pageNum === page ? "active" : ""}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              {showTrailingEllipsis && <span className="pagination-ellipsis">...</span>}

              {pageList[pageList.length - 1] < totalPages && (
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              )}

              <button
                type="button"
                className="pagination-btn nav"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading}
              >
                Sau
              </button>
            </div>

            <div className="pagination-summary">
              Trang {page}/{totalPages} • {totalElements} san
            </div>
          </div>
        )}

        {detailLoading && (
          <div className="loading-more">Dang tai chi tiet san...</div>
        )}
      </div>

      {selectedVenue && (
        <VenueDetailModal
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
          onBook={() =>
            navigate(`/booking?fieldId=${encodeURIComponent(selectedVenue.id || "")}`)
          }
        />
      )}
    </div>
  );
}
