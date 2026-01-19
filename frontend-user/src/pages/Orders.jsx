import { useEffect, useState } from "react";
import cartApi from "../api/cartApi";
import "./Orders.css";

export default function UserLibrary() {
  const [purchaseCart, setPurchaseCart] = useState([]);
  const [rentalCart, setRentalCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const purchase = await cartApi.getPurchaseCart();
      const rental = await cartApi.getRentalCart();

      setPurchaseCart(purchase || []);
      setRentalCart(rental || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) {
    return <div className="loading">Loading library...</div>;
  }

  return (
    <div className="library-page">
      <h1 className="library-title">Your Library</h1>

      {/* ================= PURCHASED BOOKS ================= */}
      <div className="library-section">
        <h2 className="section-header">Purchased Books</h2>

        {purchaseCart.length === 0 ? (
          <div className="empty-state">No purchased books.</div>
        ) : (
          <ul className="book-list">
            {purchaseCart.map((item) => (
              <li
                key={item.id}
                className="book-item purchase"
              >
                <div className="book-row">
                  <div className="book-info">
                    <span className="book-title">
                      {item.book?.title}
                    </span>
                    <span className="order-id">
                      Order ID: #{item.id}
                    </span>
                  </div>

                  <span className="book-price">
                    ₹{item.book?.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ================= RENTED BOOKS ================= */}
      <div className="library-section">
        <h2 className="section-header">Currently Rented</h2>

        {rentalCart.length === 0 ? (
          <div className="empty-state">No active rentals.</div>
        ) : (
          <ul className="book-list">
            {rentalCart.map((item) => (
              <li
                key={item.id}
                className="book-item rental"
              >
                <div className="book-row">
                  <div className="book-info">
                    <span className="book-title">
                      {item.book?.title}
                    </span>
                    <span className="order-id">
                      Rental ID: #{item.id}
                    </span>
                  </div>

                  <span className="book-expiry">
                    Expires: {item.expiry_date}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
