import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    query: "",
    genre: "",
    availability: "",
    rating: "",
    priceMin: "",
    priceMax: "",
  });

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    navigate(`/books?${params.toString()}`);
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.clear(); // or removeItem("token")
    navigate("/login");   // or navigate("/")
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Brand */}
        <Link to="/" className="nav-brand">
          📚 Library
        </Link>

        {/* Search Bar */}
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            name="query"
            type="text"
            placeholder="Search title, author, ISBN..."
            value={filters.query}
            onChange={handleChange}
          />

          <select name="genre" value={filters.genre} onChange={handleChange}>
            <option value="">Genre</option>
            <option value="fiction">Fiction</option>
            <option value="fantasy">Fantasy</option>
            <option value="romance">Romance</option>
            <option value="horror">Horror</option>
            <option value="scifi">Sci-Fi</option>
          </select>

          <select
            name="availability"
            value={filters.availability}
            onChange={handleChange}
          >
            <option value="">Availability</option>
            <option value="in_stock">In Stock</option>
            <option value="out_stock">Out of Stock</option>
          </select>

          <input
            name="priceMin"
            type="number"
            placeholder="Min ₹"
            value={filters.priceMin}
            onChange={handleChange}
          />

          <input
            name="priceMax"
            type="number"
            placeholder="Max ₹"
            value={filters.priceMax}
            onChange={handleChange}
          />

          <button type="submit">Search</button>
        </form>

        {/* Navigation Links + Logout */}
        <div className="nav-links">
          <Link to="/books">Books</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/profiles">Profile</Link>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}
