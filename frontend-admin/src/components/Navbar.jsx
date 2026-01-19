import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/authStore";
import "./Navbar.css";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // search/filter state
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [availability, setAvailability] = useState("");
  const [rating, setRating] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (query) params.append("search", query);
    if (genre) params.append("genre", genre);
    if (availability) params.append("availability", availability);
    if (rating) params.append("rating", rating);
    if (priceMin) params.append("price_min", priceMin);
    if (priceMax) params.append("price_max", priceMax);

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

        {/* Links */}
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/books">Books</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/profiles">Users</Link>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}
