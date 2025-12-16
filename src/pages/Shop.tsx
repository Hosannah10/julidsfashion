import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { type Product } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./styles/Shop.css";
import { fetchProducts } from "../services/api";
import CartIcon from "../components/CartIcon";
import { Helmet } from "react-helmet-async";

const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [page, setPage] = useState(1);
  const limit = 8;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>(initialCategory);
  const [query, setQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    fetchProducts().then((d:any)=> setProducts(Array.isArray(d)?d:[])).catch(console.error);
  }, []);

  const categories = useMemo(() => ["all", "asoebi", "corporate", "male", "kiddies"], []);

  const filtered = products.filter((p) => {
    const catOK = category === "all" ? true : p.category === category;
    const q = query.trim().toLowerCase();
    const searchOK = !q || `${p.wearName} ${p.category} ${p.price || ''}`.toLowerCase().includes(q);
    return catOK && searchOK;
  });

  const sortedProducts = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => a.price - b.price); // default low → high

    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      case "a-z":
        return sorted.sort((a, b) => a.wearName.localeCompare(b.wearName));
      case "z-a":
        return sorted.sort((a, b) => b.wearName.localeCompare(a.wearName));
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [filtered, sortOption]);

  // PAGINATION SLICE
  const start = (page - 1) * limit;
  const paginatedProducts = sortedProducts.slice(start, start + limit);

  const totalPages = Math.ceil(sortedProducts.length / limit);


  const handleAdd = (product: any) => {
    if (!user) {
      showToast("You need to log in or create an account before placing an order.");
      navigate("/login");
      return;
    }
    addToCart(product, 1);
    showToast("Added to cart!");
  };

  return (
    <section className="shop container">
      <Helmet>
        <title>Shop Luxury Wears | JuliD’s Fashion World</title>
        <meta
          name="description"
          content="Shop premium ready-made wears including corporate, casual, streetwear, and kiddies fashion from JuliD’s Fashion World."
        />
        <link rel="canonical" href="https://julidsfashion.com/shop" />
      </Helmet>

      <div className="shop-header">
        <div className="shop-header-text">
          <h2>Shop Our Collection</h2>
          <p>Discover timeless designs crafted for confidence and elegance...</p>
        </div>
        <br />
        <div className="shop-mid-actions">
          <Link to="/shop-orders" className="orders-text">Orders</Link>
          <div className="cart-wrap">
            <CartIcon />
          </div>
        </div>
      </div>

      <div className="shop-controls">
        <div className="category-list">
          {categories.map((c) => (
            <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="shop-filters">
          <div className="search-bar">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search wears, categories, or prices..." />
          </div>

          <div className="sort-dropdown">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="default">Sort by Default</option>
              <option value="newest">Newest</option>
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="product-grid">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((p) => (
            <div key={p.id} className="product-card fade-in">
              <Link to={`/product/${p.id}`}>
                <div className="image-wrap">
                  <img src={p.image || ''} alt={`${p.wearName} by JuliD’s Fashion World`} loading="lazy" />
                </div>
              </Link>
              <h3>{p.wearName}</h3>
              <p className="price">₦{p.price?.toLocaleString?.()}</p>
              <p className="category">{p.category}</p>
              <div className="actions">
                <button onClick={() => handleAdd({product:p})}>Add to Cart</button>
                <Link to={`/product/${p.id}`} className="details">View</Link>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No wears found for your search.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button 
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

    </section>
  );
};

export default Shop;
