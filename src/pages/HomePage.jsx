import { useCallback, useEffect, useRef, useState } from "react";
import VenueCard from "../components/VenueCard/VenueCard";
import Loading from "../components/Loading";
import { getAllVenues } from "../services/venueService";
import { mockVenues } from "../services/mockData";
import "./homePage.css";

const USE_MOCK_DATA = true; // Chuyen sang false khi da co API backend
const PAGE_SIZE = 9; // 3 hang x 3 the

export default function HomePage() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
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
      setError("Khong the tai danh sach san. Vui long thu lai.");
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

  const isInitialLoading = page === 1 && loading && venues.length === 0;

  if (isInitialLoading) {
    return <Loading />;
  }

  return (
    <div className="home-page">
      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <div className="venues-grid">
          {venues.length > 0 ? (
            venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
          ) : (
            <div className="no-venues">Khong tim thay san nao</div>
          )}
        </div>

        <div ref={loadMoreRef} style={{ height: 1 }} />

        {loading && venues.length > 0 && (
          <div className="loading-more">Dang tai them san...</div>
        )}

        {!hasMore && venues.length > 0 && (
          <div className="loading-more done">Da tai het danh sach san.</div>
        )}
      </div>
    </div>
  );
}
