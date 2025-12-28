import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VenueCard from "../../components/venue/VenueCard/VenueCard";
import VenueDetailModal from "../../components/venue/VenueDetailModal/VenueDetailModal";
import Loading from "../../components/common/Loading";
import { getAllVenues, getVenueDetail } from "../../services/venueService";
import { mockVenues } from "../../services/mockData";
import avatar from "../../assets/logoV1.png";
import "./homePage.css";

const USE_MOCK_DATA = false; // Using backend API
const PAGE_SIZE = 9; // 3 hang x 3 the

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
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const loadMoreRef = useRef(null);

  const fetchPage = useCallback(async (targetPage) => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        const start = (targetPage - 1) * PAGE_SIZE;
        const next = mockVenues.slice(start, start + PAGE_SIZE);
        setVenues((prev) => (targetPage === 1 ? next : [...prev, ...next]));
        setHasMore(start + PAGE_SIZE < mockVenues.length);
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

      setVenues((prev) => (targetPage === 1 ? mapped : [...prev, ...mapped]));

      const pageNumber =
        typeof payload.pageNumber === "number"
          ? payload.pageNumber
          : targetPage - 1;
      const totalPages =
        typeof payload.totalPages === "number" ? payload.totalPages : undefined;

      const more =
        payload.last === false
          ? true
          : totalPages
          ? pageNumber + 1 < totalPages
          : mapped.length === PAGE_SIZE;

      setHasMore(more && mapped.length > 0);
    } catch (err) {
      console.error("Failed to load venues:", err);
      setError("Không thể tải danh sách sân. Vui lòng thử lại.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 320) setHasUserScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading && hasUserScrolled) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [hasMore, loading, hasUserScrolled]);

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
    // Khi có rating từ BE: ưu tiên sort theo rating desc
    if (list.length && typeof list[0]?.rating !== "undefined") {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [venues, searchTerm]);

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
            <div className="no-venues">Không tìm thấy sân nào</div>
          )}
        </div>

        <div ref={loadMoreRef} style={{ height: 1 }} />

        {loading && venues.length > 0 && (
          <div className="loading-more">Đang tải thêm sân...</div>
        )}

        {!hasMore && venues.length > 0 && (
          <div className="loading-more done">
            Đã tải hết sân phù hợp bạn nhé!
          </div>
        )}
        {detailLoading && (
          <div className="loading-more">Đang tải chi tiết sân...</div>
        )}
      </div>

      {selectedVenue && (
        <VenueDetailModal
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
          onBook={() => navigate("/booking")}
        />
      )}
    </div>
  );
}
