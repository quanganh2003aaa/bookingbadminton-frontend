import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted) setError(err.message || "Lỗi khi gọi API");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — {p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
