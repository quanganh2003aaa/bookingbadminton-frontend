import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VenueCard from "../../components/venue/VenueCard/VenueCard";
import VenueDetailModal from "../../components/venue/VenueDetailModal/VenueDetailModal";
import Loading from "../../components/common/Loading";
import { getAllVenues } from "../../services/venueService";
import { mockVenues } from "../../services/mockData";
import "./homePage.css";

const USE_MOCK_DATA = true; // Chuyển sang false khi có API backend
const PAGE_SIZE = 9; // 3 hàng x 3 thẻ

export default function HomePage() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
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
      });

      const items = data?.items || data?.data || data || [];
      setVenues((prev) => (targetPage === 1 ? items : [...prev, ...items]));
      const more =
        typeof data?.hasMore !== "undefined"
          ? data.hasMore
          : items.length === PAGE_SIZE;
      setHasMore(more);
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
                onBook={() => navigate("/booking")}
                onSelect={(v) => setSelectedVenue(v)}
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
